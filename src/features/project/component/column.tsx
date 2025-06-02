"use client";

import { Dispatch, DragEvent, SetStateAction, useState } from "react";

import { Tasks, TaskStatus } from "../types";
import AddCard from "./add-card";
import KanbanCard from "./card";
import DropIndicator from "./drop-indicator";

type KanbanColumnProps = {
	title: string;
	headingColor: string;
	tasks: Tasks[];
	column: TaskStatus;
	setTasks: Dispatch<SetStateAction<Tasks[]>>;
};

const KanbanColumn = (props: KanbanColumnProps) => {
	const [active, setActive] = useState(false);

	const handleDragStart = (e: DragEvent, task: Tasks) => {
		e.dataTransfer.setData("taskId", task.id);
	};

	const handleDragEnd = (e: DragEvent) => {
		const taskId = e.dataTransfer.getData("taskId");

		setActive(false);
		clearHighlights();

		const indicators = getIndicators();
		const { element } = getNearestIndicator(e, indicators);

		const before = element.dataset.before ?? "-1";

		if (before !== taskId) {
			let copy = [...props.tasks];

			let taskToTransfer = copy.find((t) => t.id === taskId);
			if (!taskToTransfer) return;
			taskToTransfer = { ...taskToTransfer, status: props.column };

			copy = copy.filter((t) => t.id !== taskId);

			const moveToBack = before === "-1";

			if (moveToBack) {
				copy.push(taskToTransfer);
			} else {
				const insertAtIndex = copy.findIndex((el) => el.id === before);
				if (insertAtIndex === undefined) return;

				copy.splice(insertAtIndex, 0, taskToTransfer);
			}

			props.setTasks(copy);
		}
	};

	const handleDragOver = (e: DragEvent) => {
		e.preventDefault();
		highlightIndicator(e);

		setActive(true);
	};

	const clearHighlights = (els?: HTMLElement[]) => {
		const indicators = els || getIndicators();

		indicators.forEach((i) => {
			i.style.opacity = "0";
		});
	};

	const highlightIndicator = (e: DragEvent) => {
		const indicators = getIndicators();

		clearHighlights(indicators);

		const el = getNearestIndicator(e, indicators);

		el.element.style.opacity = "1";
	};

	const getNearestIndicator = (e: DragEvent, indicators: HTMLElement[]) => {
		const DISTANCE_OFFSET = 50;

		const el = indicators.reduce(
			(closest, child) => {
				const box = child.getBoundingClientRect();

				const offset = e.clientY - (box.top + DISTANCE_OFFSET);

				if (offset < 0 && offset > closest.offset) {
					return { offset: offset, element: child };
				} else {
					return closest;
				}
			},
			{
				offset: Number.NEGATIVE_INFINITY,
				element: indicators[indicators.length - 1],
			},
		);

		return el;
	};

	const getIndicators = () => {
		return Array.from(
			document.querySelectorAll(
				`[data-column="${props.column}"]`,
			) as unknown as HTMLElement[],
		);
	};

	const handleDragLeave = () => {
		clearHighlights();
		setActive(false);
	};

	const filteredTasks = props.tasks.filter((t) => t.status === props.column);

	return (
		<div className="w-56 shrink-0">
			<div className="mb-3 flex items-center justify-between">
				<h3 className={`font-medium ${props.headingColor}`}>{props.title}</h3>
				<span className="rounded text-sm text-neutral-400">
					{filteredTasks.length}
				</span>
			</div>
			<div
				onDrop={handleDragEnd}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				className={`h-full w-full transition-colors ${
					active ? "bg-neutral-800/50" : "bg-neutral-800/0"
				}`}
			>
				{filteredTasks.map((t) => {
					return (
						<KanbanCard key={t.id} {...t} handleDragStart={handleDragStart} />
					);
				})}
				<DropIndicator beforeId={null} column={props.column} />
				<AddCard column={props.column} setTasks={props.setTasks} />
			</div>
		</div>
	);
};

export default KanbanColumn;
