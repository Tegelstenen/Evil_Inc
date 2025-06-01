type ConversationOrbProps = {
	isSessionActive: boolean;
	isAgentSpeaking: boolean | null;
};

const ConversationOrb = (props: ConversationOrbProps) => {
	const getBackgroundColor = () => {
		if (!props.isSessionActive) return "#f44336";
		if (props.isAgentSpeaking) return "#FFA500";
		return "#4CAF50";
	};

	const getText = () => {
		if (!props.isSessionActive) return "Start a Conversation";
		if (props.isAgentSpeaking) return "Talking";
		return "Listening";
	};

	return (
		<div
			style={{
				width: "100px",
				height: "100px",
				border: "2px solid black",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: getBackgroundColor(),
			}}
		>
			{getText()}
		</div>
	);
};

export default ConversationOrb;
