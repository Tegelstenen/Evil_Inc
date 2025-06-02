// Each goal is a project
export interface Project {
	title: string;
	description: string;
	context: string;
	target_date: string;
	estimated_hours: number;
	success_criteria: string[];
	milestones: Milestone[];
}

// Each project has multiple milestones that need to be achieved
export interface Milestone {
	id: string;
	title: string;
	description: string;
	start_date: string;
	expected_completion_date: string;
	estimated_hours?: number;
	completed: boolean;
	tasks: Tasks[];
}

// Each milestone has multiple issues that need to be completed, they are the smallest unit of work, and more flexible than milestones. User can move these around on a kanban and connect issues to each other.
export interface Tasks {
	id: string;
	description: string;
	estimated_minutes: number;
	actual_minutes?: number;
	priority: Priority;
	status: TaskStatus;
	days_span: number; // Number of days this task should be focused on
}

export type TaskStatus = "todo" | "in_progress" | "done" | "blocked";
export type Priority = "none" | "low" | "medium" | "high";
