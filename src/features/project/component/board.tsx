"use client";

import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Tasks } from "../types";
import KanbanColumn from "./column";

const KanbanBoard = () => {
	const [tasks, setTasks] = useState<Tasks[]>(DEFAULT_TASKS);

	return (
		<Card className="h-full w-full">
			<CardHeader>
				<CardTitle className="text-2xl">Task Board</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex h-full w-full gap-3 overflow-x-auto">
					<KanbanColumn
						title="TODO"
						column="todo"
						headingColor="text-yellow-200"
						tasks={tasks}
						setTasks={setTasks}
					/>
					<KanbanColumn
						title="In progress"
						column="in_progress"
						headingColor="text-blue-200"
						tasks={tasks}
						setTasks={setTasks}
					/>
					<KanbanColumn
						title="Complete"
						column="done"
						headingColor="text-emerald-200"
						tasks={tasks}
						setTasks={setTasks}
					/>
				</div>
			</CardContent>
		</Card>
	);
};

export default KanbanBoard;

const DEFAULT_TASKS: Tasks[] = [
	{
		id: "1",
		description: "Research DB options for new microservice",
		status: "todo",
		estimated_minutes: 120,
		priority: "high",
	},
	{
		id: "2",
		description: "Postmortem for outage",
		status: "todo",
		estimated_minutes: 60,
		priority: "high",
	},
	{
		id: "3",
		description: "Sync with product on Q3 roadmap",
		status: "todo",
		estimated_minutes: 90,
		priority: "medium",
	},
	{
		id: "4",
		description: "Refactor context providers to use Zustand",
		status: "in_progress",
		estimated_minutes: 240,
		priority: "medium",
	},
	{
		id: "5",
		description: "Add logging to daily CRON",
		status: "in_progress",
		estimated_minutes: 60,
		priority: "low",
	},
	{
		id: "6",
		description: "Set up DD dashboards for Lambda listener",
		status: "done",
		estimated_minutes: 180,
		priority: "medium",
	},
];
