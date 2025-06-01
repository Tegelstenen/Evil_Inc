"use client";

import { useEffect, useRef, useState } from "react";

import { getToken } from "../services";
import { ConversationEvent } from "../types";

type UseConversationReturn = {
	isSessionActive: boolean;
	isAgentSpeaking: boolean;
	events: ConversationEvent[];
	audioIntensity: number;
	startSession: () => Promise<void>;
	stopSession: () => void;
	sendClientEvent: (message: ConversationEvent) => void;
	sendTextMessage: (message: string) => void;
};

const useConversation = (): UseConversationReturn => {
	const [isSessionActive, setIsSessionActive] = useState(false);
	const [events, setEvents] = useState<ConversationEvent[]>([]);
	const [isAgentSpeaking, setIsAgentSpeaking] = useState<boolean>(false);
	const [audioIntensity, setAudioIntensity] = useState<number>(0);
	const [dataChannel, setDataChannel] = useState<RTCDataChannel | null>(null);
	const peerConnection = useRef<RTCPeerConnection | null>(null);
	const audioElement = useRef<HTMLAudioElement | null>(null);
	const audioContext = useRef<AudioContext | null>(null);
	const analyser = useRef<AnalyserNode | null>(null);
	const streamStartTime = useRef<number | null>(null);

	const startSession = async () => {
		// Get a session token using the server action
		const data = await getToken();
		const EPHEMERAL_KEY = data.client_secret.value;

		// Create a peer connection
		const pc = new RTCPeerConnection();

		// Set up to play remote audio from the model
		const audio = document.createElement("audio");
		audio.autoplay = true;
		audioElement.current = audio;

		// Set up audio analysis
		audioContext.current = new AudioContext();
		analyser.current = audioContext.current.createAnalyser();
		analyser.current.fftSize = 256;

		pc.ontrack = (e) => {
			if (audioElement.current) {
				audioElement.current.srcObject = e.streams[0];
				// Connect the audio stream to the analyzer
				const source = audioContext.current!.createMediaStreamSource(
					e.streams[0],
				);
				source.connect(analyser.current!);

				// Start analyzing audio
				const dataArray = new Uint8Array(analyser.current!.frequencyBinCount);
				streamStartTime.current = Date.now();
				const analyzeAudio = () => {
					if (analyser.current) {
						analyser.current.getByteFrequencyData(dataArray);
						// Calculate average intensity
						const average =
							dataArray.reduce((a, b) => a + b) / dataArray.length;
						setAudioIntensity(average);
						requestAnimationFrame(analyzeAudio);
					}
				};
				analyzeAudio();
			}
		};

		// Add local audio track for microphone input in the browser
		const ms = await navigator.mediaDevices.getUserMedia({
			audio: true,
		});
		pc.addTrack(ms.getTracks()[0]);

		// Set up data channel for sending and receiving events
		const dc = pc.createDataChannel("oai-events");
		setDataChannel(dc);

		// Start the session using the Session Description Protocol (SDP)
		const offer = await pc.createOffer();
		await pc.setLocalDescription(offer);

		const baseUrl = "https://api.openai.com/v1/realtime";
		const model = "gpt-4o-realtime-preview-2024-12-17";
		const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
			method: "POST",
			body: offer.sdp,
			headers: {
				Authorization: `Bearer ${EPHEMERAL_KEY}`,
				"Content-Type": "application/sdp",
			},
		});

		const answer = {
			type: "answer" as const,
			sdp: await sdpResponse.text(),
		};
		await pc.setRemoteDescription(answer);

		peerConnection.current = pc;
	};

	const stopSession = () => {
		if (dataChannel) {
			dataChannel.close();
		}

		if (peerConnection.current) {
			peerConnection.current.getSenders().forEach((sender) => {
				if (sender.track) {
					sender.track.stop();
				}
			});
			peerConnection.current.close();
		}

		if (audioContext.current) {
			audioContext.current.close();
		}

		setIsAgentSpeaking(false);
		setIsSessionActive(false);
		setDataChannel(null);
		peerConnection.current = null;
		audioContext.current = null;
		analyser.current = null;
		streamStartTime.current = null;
	};

	const sendClientEvent = (message: ConversationEvent) => {
		if (dataChannel) {
			const timestamp = new Date().toLocaleTimeString();
			message.event_id = message.event_id ?? crypto.randomUUID();

			// send event before setting timestamp since the backend peer doesn't expect this field
			dataChannel.send(JSON.stringify(message));

			// if guard just in case the timestamp exists by miracle
			message.timestamp ??= timestamp;
			setEvents((prev) => [message, ...prev]);
		} else {
			console.error(
				"Failed to send message - no data channel available",
				message,
			);
		}
	};

	const sendTextMessage = (message: string) => {
		const event = {
			type: "conversation.item.create",
			item: {
				type: "message",
				role: "user",
				content: [
					{
						type: "input_text",
						text: message,
					},
				],
			},
		};

		sendClientEvent(event);
		sendClientEvent({ type: "response.create" });
	};

	useEffect(() => {
		if (dataChannel) {
			// Append new server events to the list
			dataChannel.addEventListener("message", (e) => {
				const event = JSON.parse(e.data);
				event.timestamp ??= new Date().toLocaleTimeString();

				setEvents((prev) => [event, ...prev]);

				if (event.type === "output_audio_buffer.started") {
					setIsAgentSpeaking(true);
				} else if (event.type === "output_audio_buffer.stopped") {
					setIsAgentSpeaking(false);
					setAudioIntensity(0);
				}
			});

			// Set session active when the data channel is opened
			dataChannel.addEventListener("open", () => {
				setIsSessionActive(true);
				setEvents([]);
			});
		}
	}, [dataChannel]);

	// Cleanup effect to stop session when component unmounts
	useEffect(() => {
		return () => {
			if (isSessionActive) {
				stopSession();
			}
		};
	}, [isSessionActive]);

	return {
		isSessionActive,
		isAgentSpeaking,
		events,
		audioIntensity,
		startSession,
		stopSession,
		sendClientEvent,
		sendTextMessage,
	};
};

export default useConversation;
