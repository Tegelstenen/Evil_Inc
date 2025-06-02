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
	id: number;
	title: string;
	description: string;
	expected_completion_date: string;
	estimated_hours?: number;
	current_hours?: number;
	completed: boolean;
	issues: Issues[];
	resources?: Resource[];
	insights?: Insight[];
	priority: Priority;
}

// Each milestone has multiple issues that need to be completed, they are the smallest unit of work, and more flexible than milestones. User can move these around on a kanban and connect issues to each other.
export interface Issues {
	id: string;
	description: string;
	estimated_minutes: number;
	actual_minutes?: number;
	completed: boolean;
	priority: Priority;
	status: IssueStatus;
	resources?: Resource[];
}
export type IssueStatus = "todo" | "in_progress" | "done" | "blocked";
export type Priority = "none" | "low" | "medium" | "high";

// Resources are external links to articles, videos, tools, etc. that are relevant to a project, milestone, or issue. They can be used to justify a particular objective or to guide the user in their work.
export interface Resource {
	type: ResourceType;
	url: string;
	description: string;
}
export type ResourceType = "article" | "video" | "tool" | "other";

// Notes are generated as the user progress with their project. It is relevant facts that the AI agent has derived from the user's work and conversations.
export interface Insight {
	id: string;
	content: string;
	date: string;
}
