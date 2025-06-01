"use client";

import {
	ConversationControls,
	ConversationEvent,
	ConversationOrb,
	useConversation,
} from "@/features/conversation";

const EventComponent = (props: ConversationEvent) => {
	return (
		<li className="rounded-md border p-2 text-white" key={props.event_id}>
			<div className="font-semibold">{props.type}</div>
			{props.response?.output && (
				<div className="mt-2">
					{props.response.output.map((output, index) => (
						<div key={index} className="text-sm">
							{output.type}: {output.name} {output.arguments}
						</div>
					))}
				</div>
			)}
			{props.response?.instructions && (
				<div className="mt-2 text-sm text-gray-300">
					{props.response.instructions}
				</div>
			)}
		</li>
	);
};

const OnboardingPage = () => {
	const {
		isSessionActive,
		events,
		startSession,
		stopSession,
		isAgentSpeaking,
	} = useConversation();

	return (
		<div className="fixed inset-0 flex flex-col items-center justify-center">
			<ConversationOrb
				isSessionActive={isSessionActive}
				isAgentSpeaking={isAgentSpeaking}
			/>
			<ConversationControls
				isSessionActive={isSessionActive}
				startSession={startSession}
				stopSession={stopSession}
			/>
			<div>
				<h1 className="text-2xl font-bold text-white">Events</h1>
				<div className="h-86 overflow-y-auto rounded-md border p-4">
					<ul className="flex flex-col gap-2">
						{events.map((event) => (
							<EventComponent key={event.event_id} {...event} />
						))}
					</ul>
				</div>
			</div>
		</div>
	);
};

export default OnboardingPage;
