"use client";

import { Button } from "@/components/ui/button";
import { Orb, useConversation } from "@/features/conversation";

// Example usage component
const ConversationPage = () => {
	const {
		isSessionActive,
		isAgentSpeaking,
		audioIntensity,
		startSession,
		stopSession,
	} = useConversation();

	return (
		<div className="flex min-h-screen w-full flex-col justify-center">
			<Orb
				isActive={isSessionActive}
				isTalking={isAgentSpeaking}
				talkingIntensity={audioIntensity}
			/>
			<div className="mt-4 flex justify-center gap-4">
				<Button
					onClick={() => {
						if (isSessionActive) {
							stopSession();
						} else {
							startSession();
						}
					}}
					className="border border-white bg-black text-white hover:bg-gray-800"
				>
					{isSessionActive ? "Deactivate" : "Activate"}
				</Button>
			</div>
		</div>
	);
};

export default ConversationPage;
