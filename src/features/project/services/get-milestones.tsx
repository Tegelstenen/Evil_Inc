import { Project } from "../types/project.types";

// Helper function to get future date
const getFutureDate = (daysFromNow: number): string => {
	const date = new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000);
	return date.toISOString().split("T")[0];
};

// Helper function to get past date
const getPastDate = (daysAgo: number): string => {
	const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
	return date.toISOString().split("T")[0];
};

export const mockGetProject = async (projectId: string): Promise<Project> => {
	await new Promise((resolve) => setTimeout(resolve, 1000));

	if (projectId === "1") {
		return project1;
	}

	if (projectId === "2") {
		return project2;
	}

	throw new Error("Project not found");
};

const project1: Project = {
	title: "Website Redesign Project",
	description:
		"Complete overhaul of the company website with modern design and improved user experience",
	context:
		"Current website is outdated and not mobile-friendly. Need to improve user engagement and conversion rates.",
	target_date: getFutureDate(120),
	estimated_hours: 94,
	success_criteria: [
		"Mobile responsiveness score > 90",
		"Page load time < 2 seconds",
		"User engagement metrics improve by 30%",
		"Conversion rate increases by 25%",
	],
	milestones: [
		{
			id: "p1m1",
			title: "Design and Planning",
			description: "Create wireframes and plan the website structure",
			start_date: getPastDate(15),
			expected_completion_date: getFutureDate(45),
			estimated_hours: 24,
			completed: false,
			tasks: [
				{
					id: "1-1",
					description: "Create wireframes for all pages",
					estimated_minutes: 480,
					priority: "high",
					status: "in_progress",
					days_span: 25,
				},
				{
					id: "1-2",
					description: "Define color scheme and typography",
					estimated_minutes: 360,
					priority: "medium",
					status: "done",
					days_span: 15,
				},
				{
					id: "1-3",
					description: "Plan content structure",
					estimated_minutes: 480,
					priority: "medium",
					status: "blocked",
					days_span: 30,
				},
			],
		},
		{
			id: "p1m2",
			title: "Frontend Development",
			description:
				"Implement the website's frontend using React and Tailwind CSS",
			start_date: getFutureDate(45),
			expected_completion_date: getFutureDate(90),
			estimated_hours: 40,
			completed: false,
			tasks: [
				{
					id: "2-1",
					description: "Set up React project with Tailwind CSS",
					estimated_minutes: 360,
					priority: "high",
					status: "todo",
					days_span: 12,
				},
				{
					id: "2-2",
					description: "Implement responsive layout",
					estimated_minutes: 720,
					priority: "high",
					status: "in_progress",
					days_span: 35,
				},
				{
					id: "2-3",
					description: "Create reusable components",
					estimated_minutes: 960,
					priority: "medium",
					status: "todo",
					days_span: 25,
				},
			],
		},
		{
			id: "p1m3",
			title: "Content and Deployment",
			description: "Add content and deploy the website",
			start_date: getFutureDate(90),
			expected_completion_date: getFutureDate(120),
			estimated_hours: 30,
			completed: false,
			tasks: [
				{
					id: "3-1",
					description: "Write and add content",
					estimated_minutes: 720,
					priority: "high",
					status: "blocked",
					days_span: 40,
				},
				{
					id: "3-2",
					description: "Optimize images and assets",
					estimated_minutes: 360,
					priority: "medium",
					status: "done",
					days_span: 20,
				},
				{
					id: "3-3",
					description: "Deploy to Vercel",
					estimated_minutes: 180,
					priority: "high",
					status: "todo",
					days_span: 15,
				},
			],
		},
	],
};

const project2: Project = {
	title: "Sales Strategy Implementation",
	description:
		"Develop and implement new sales strategies to increase revenue and market share",
	context:
		"Current sales performance is below targets. Need to revamp sales approach and improve team performance.",
	target_date: getFutureDate(120),
	estimated_hours: 120,
	success_criteria: [
		"Revenue growth of 40%",
		"Customer acquisition cost reduction by 20%",
		"Sales team productivity increase by 35%",
		"Market share growth of 15%",
	],
	milestones: [
		{
			id: "p2m1",
			title: "Sales Strategy Development",
			description:
				"Analyze current performance and develop new sales strategies",
			start_date: getPastDate(20),
			expected_completion_date: getFutureDate(40),
			estimated_hours: 30,
			completed: false,
			tasks: [
				{
					id: "1-1",
					description: "Conduct market analysis and competitor research",
					estimated_minutes: 720,
					priority: "high",
					status: "in_progress",
					days_span: 45,
				},
				{
					id: "1-2",
					description: "Review current sales funnel and identify bottlenecks",
					estimated_minutes: 540,
					priority: "high",
					status: "done",
					days_span: 30,
				},
				{
					id: "1-3",
					description: "Develop new pricing strategy",
					estimated_minutes: 720,
					priority: "medium",
					status: "blocked",
					days_span: 35,
				},
			],
		},
		{
			id: "p2m2",
			title: "Sales Team Training",
			description: "Implement new sales techniques and tools for the team",
			start_date: getFutureDate(40),
			expected_completion_date: getFutureDate(90),
			estimated_hours: 50,
			completed: false,
			tasks: [
				{
					id: "2-1",
					description: "Develop sales training materials",
					estimated_minutes: 1080,
					priority: "high",
					status: "in_progress",
					days_span: 50,
				},
				{
					id: "2-2",
					description: "Implement new CRM system",
					estimated_minutes: 1440,
					priority: "high",
					status: "todo",
					days_span: 60,
				},
				{
					id: "2-3",
					description: "Conduct sales technique workshops",
					estimated_minutes: 2160,
					priority: "medium",
					status: "blocked",
					days_span: 45,
				},
			],
		},
		{
			id: "p2m3",
			title: "Implementation and Monitoring",
			description: "Launch new strategies and track performance metrics",
			start_date: getFutureDate(90),
			expected_completion_date: getFutureDate(120),
			estimated_hours: 40,
			completed: false,
			tasks: [
				{
					id: "3-1",
					description: "Set up performance tracking dashboards",
					estimated_minutes: 720,
					priority: "high",
					status: "done",
					days_span: 25,
				},
				{
					id: "3-2",
					description: "Launch new marketing campaigns",
					estimated_minutes: 1080,
					priority: "high",
					status: "in_progress",
					days_span: 40,
				},
				{
					id: "3-3",
					description: "Conduct initial performance review",
					estimated_minutes: 540,
					priority: "high",
					status: "todo",
					days_span: 30,
				},
			],
		},
	],
};
