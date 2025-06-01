export interface Resource {
	type: "article" | "video" | "tool" | "other";
	url?: string;
	description: string;
}

export interface Subtask {
	id: string;
	description: string;
	estimated_minutes: number;
	completed: boolean;
}

export interface Metric {
	measurement: string;
	target_value?: number;
}

export interface Milestone {
	id: number;
	title: string;
	description: string;
	expected_completion_date: string;
	estimated_hours?: number;
	completed: boolean;
	metrics?: Metric;
	subtasks?: Subtask[];
	resources?: Resource[];
	prerequisites?: number[];
}

export interface Goal {
	title: string;
	description: string;
	target_date: string;
	estimated_total_hours: number;
	milestones: Milestone[];
}

export interface SubtaskUpdate {
	milestoneId: number;
	subtaskId: string;
	completed: boolean;
}

export interface MilestoneUpdate {
	milestoneId: number;
	completed: boolean;
}
