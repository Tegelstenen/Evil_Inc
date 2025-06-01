export type ConversationEvent = {
	type: string;
	event_id?: string;
	timestamp?: string;
	response?: {
		output?: Array<{
			type: string;
			name?: string;
			arguments?: string;
		}>;
		instructions?: string;
	};
};
