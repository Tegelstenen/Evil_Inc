"use client";

import { Goal, GoalBox, MilestoneUpdate, SubtaskUpdate } from "@/features/goal";

const onSubtaskUpdate = async (update: SubtaskUpdate) => {
	console.log("Subtask update:", update);
	// In a real application, this would make an API call to update the subtask
};

const onMilestoneUpdate = async (update: MilestoneUpdate) => {
	console.log("Milestone update:", update);
	// In a real application, this would make an API call to update the milestone
};

const GoalExamplePage = () => {
	return (
		<div className="flex h-screen flex-col items-center justify-center">
			<GoalBox
				goal={goal}
				milestones={goal.milestones}
				onSubtaskUpdate={onSubtaskUpdate}
				onMilestoneUpdate={onMilestoneUpdate}
			/>
		</div>
	);
};

export default GoalExamplePage;

const goal: Goal = {
	title: "Build a Personal Portfolio Website",
	description:
		"Create a modern, responsive portfolio website to showcase my projects and skills",
	target_date: "2024-06-30",
	estimated_total_hours: 40,
	milestones: [
		{
			id: 1,
			title: "Design and Planning",
			description: "Create wireframes and plan the website structure",
			expected_completion_date: "2024-05-15",
			estimated_hours: 8,
			completed: false,
			subtasks: [
				{
					id: "1-1",
					description: "Create wireframes for all pages",
					estimated_minutes: 180,
					completed: false,
				},
				{
					id: "1-2",
					description: "Define color scheme and typography",
					estimated_minutes: 120,
					completed: false,
				},
				{
					id: "1-3",
					description: "Plan content structure",
					estimated_minutes: 180,
					completed: false,
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
			prerequisites: [1],
			subtasks: [
				{
					id: "2-1",
					description: "Set up React project with Tailwind CSS",
					estimated_minutes: 120,
					completed: false,
				},
				{
					id: "2-2",
					description: "Implement responsive layout",
					estimated_minutes: 240,
					completed: false,
				},
				{
					id: "2-3",
					description: "Create reusable components",
					estimated_minutes: 360,
					completed: false,
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
			prerequisites: [2],
			metrics: {
				measurement: "Website Performance Score",
				target_value: 90,
			},
			subtasks: [
				{
					id: "3-1",
					description: "Write and add content",
					estimated_minutes: 240,
					completed: false,
				},
				{
					id: "3-2",
					description: "Optimize images and assets",
					estimated_minutes: 120,
					completed: false,
				},
				{
					id: "3-3",
					description: "Deploy to Vercel",
					estimated_minutes: 60,
					completed: false,
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
