type ConversationControlsProps = {
	isSessionActive: boolean;
	startSession: () => void;
	stopSession: () => void;
};

const ConversationControls = (props: ConversationControlsProps) => {
	return (
		<div>
			<button
				className="rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600"
				disabled={props.isSessionActive}
				onClick={props.startSession}
			>
				Start Session
			</button>
			<button
				className="rounded-md bg-red-500 p-2 text-white hover:bg-red-600"
				disabled={!props.isSessionActive}
				onClick={props.stopSession}
			>
				Stop Session
			</button>
		</div>
	);
};

export default ConversationControls;
