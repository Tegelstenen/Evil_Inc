import { Project } from "../types";

export const mockGetProject = async (id: string): Promise<Project> => {
	await new Promise((resolve) => setTimeout(resolve, 1000));
	if (id === "1") {
		return project1;
	}

	if (id === "2") {
		return project2;
	}

	throw new Error("Project not found");
};

const project1: Project = {
	title: "Build a Personal Portfolio Website",
	description:
		"Create a modern, responsive portfolio website to showcase my projects and skills",
	context:
		"Personal development project to showcase my work and skills to potential employers and clients",
	success_criteria: [
		"Website achieves a performance score of 90 or higher",
		"All pages are responsive and work well on mobile devices",
		"Portfolio successfully showcases at least 3 major projects",
		"Website loads in under 3 seconds",
	],
	target_date: "2024-06-30",
	estimated_hours: 40,
	milestones: [
		{
			id: 1,
			title: "Design and Planning",
			description: "Create wireframes and plan the website structure",
			expected_completion_date: "2024-05-15",
			estimated_hours: 8,
			completed: false,
			priority: "high",
			issues: [
				{
					id: "1-1",
					description: "Create wireframes for all pages",
					estimated_minutes: 180,
					completed: false,
					priority: "high",
					status: "todo",
				},
				{
					id: "1-2",
					description: "Define color scheme and typography",
					estimated_minutes: 120,
					completed: false,
					priority: "medium",
					status: "todo",
				},
				{
					id: "1-3",
					description: "Plan content structure",
					estimated_minutes: 180,
					completed: false,
					priority: "medium",
					status: "todo",
				},
			],
			resources: [
				{
					type: "tool",
					description: "Figma for wireframing",
					url: "https://www.figma.com",
				},
			],
		},
		{
			id: 2,
			title: "Frontend Development",
			description:
				"Implement the website's frontend using React and Tailwind CSS",
			expected_completion_date: "2024-06-15",
			estimated_hours: 20,
			completed: false,
			priority: "high",
			issues: [
				{
					id: "2-1",
					description: "Set up React project with Tailwind CSS",
					estimated_minutes: 120,
					completed: false,
					priority: "high",
					status: "todo",
				},
				{
					id: "2-2",
					description: "Implement responsive layout",
					estimated_minutes: 240,
					completed: false,
					priority: "high",
					status: "todo",
				},
				{
					id: "2-3",
					description: "Create reusable components",
					estimated_minutes: 360,
					completed: false,
					priority: "medium",
					status: "todo",
				},
			],
			resources: [
				{
					type: "article",
					description: "React + Tailwind CSS Best Practices",
					url: "https://example.com/react-tailwind",
				},
			],
		},
		{
			id: 3,
			title: "Content and Deployment",
			description: "Add content and deploy the website",
			expected_completion_date: "2024-06-30",
			estimated_hours: 12,
			completed: false,
			priority: "high",
			issues: [
				{
					id: "3-1",
					description: "Write and add content",
					estimated_minutes: 240,
					completed: false,
					priority: "high",
					status: "todo",
				},
				{
					id: "3-2",
					description: "Optimize images and assets",
					estimated_minutes: 120,
					completed: false,
					priority: "medium",
					status: "todo",
				},
				{
					id: "3-3",
					description: "Deploy to Vercel",
					estimated_minutes: 60,
					completed: false,
					priority: "high",
					status: "todo",
				},
			],
			resources: [
				{
					type: "tool",
					description: "Vercel for deployment",
					url: "https://vercel.com",
				},
			],
		},
	],
};

const project2: Project = {
	title: "Boost Sales Performance",
	description:
		"Implement a comprehensive sales strategy to increase revenue and customer acquisition",
	context:
		"Business initiative to improve sales performance and market share in a competitive landscape",
	success_criteria: [
		"Increase monthly sales by 30% within 3 months",
		"Reduce customer acquisition cost by 20%",
		"Improve sales team conversion rate by 25%",
		"Achieve 90% customer satisfaction rating",
	],
	target_date: "2024-06-30",
	estimated_hours: 60,
	milestones: [
		{
			id: 1,
			title: "Sales Strategy Development",
			description:
				"Analyze current performance and develop new sales strategies",
			expected_completion_date: "2024-05-15",
			estimated_hours: 15,
			completed: false,
			priority: "high",
			issues: [
				{
					id: "1-1",
					description: "Conduct market analysis and competitor research",
					estimated_minutes: 240,
					completed: false,
					priority: "high",
					status: "todo",
				},
				{
					id: "1-2",
					description: "Review current sales funnel and identify bottlenecks",
					estimated_minutes: 180,
					completed: false,
					priority: "high",
					status: "todo",
				},
				{
					id: "1-3",
					description: "Develop new pricing strategy",
					estimated_minutes: 240,
					completed: false,
					priority: "medium",
					status: "todo",
				},
			],
			resources: [
				{
					type: "tool",
					description: "Sales Analytics Dashboard",
					url: "https://example.com/analytics",
				},
			],
		},
		{
			id: 2,
			title: "Sales Team Training",
			description: "Implement new sales techniques and tools for the team",
			expected_completion_date: "2024-06-15",
			estimated_hours: 25,
			completed: false,
			priority: "high",
			issues: [
				{
					id: "2-1",
					description: "Develop sales training materials",
					estimated_minutes: 360,
					completed: false,
					priority: "high",
					status: "todo",
				},
				{
					id: "2-2",
					description: "Implement new CRM system",
					estimated_minutes: 480,
					completed: false,
					priority: "high",
					status: "todo",
				},
				{
					id: "2-3",
					description: "Conduct sales technique workshops",
					estimated_minutes: 720,
					completed: false,
					priority: "medium",
					status: "todo",
				},
			],
			resources: [
				{
					type: "article",
					description: "Modern Sales Techniques Guide",
					url: "https://example.com/sales-guide",
				},
			],
		},
		{
			id: 3,
			title: "Implementation and Monitoring",
			description: "Launch new strategies and track performance metrics",
			expected_completion_date: "2024-06-30",
			estimated_hours: 20,
			completed: false,
			priority: "high",
			issues: [
				{
					id: "3-1",
					description: "Set up performance tracking dashboards",
					estimated_minutes: 240,
					completed: false,
					priority: "high",
					status: "todo",
				},
				{
					id: "3-2",
					description: "Launch new marketing campaigns",
					estimated_minutes: 360,
					completed: false,
					priority: "high",
					status: "todo",
				},
				{
					id: "3-3",
					description: "Conduct initial performance review",
					estimated_minutes: 180,
					completed: false,
					priority: "high",
					status: "todo",
				},
			],
			resources: [
				{
					type: "tool",
					description: "Sales Performance Analytics Platform",
					url: "https://example.com/performance",
				},
			],
		},
	],
};
