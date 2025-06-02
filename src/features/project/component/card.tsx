"use client";

import { motion, PanInfo } from "framer-motion";

import { Tasks } from "../types";
import DropIndicator from "./drop-indicator";

type KanbanCardProps = Tasks & {
	handleDragStart: (
		e: MouseEvent | TouchEvent | PointerEvent,
		info: PanInfo,
		task: Tasks,
	) => void;
};

const KanbanCard = (props: KanbanCardProps) => {
	return (
		<>
			<DropIndicator beforeId={props.id} column={props.status} />
			<motion.div
				layout
				layoutId={props.id}
				draggable="true"
				onDragStart={(e, info) => props.handleDragStart(e, info, props)}
				className="cursor-grab rounded border border-neutral-700 bg-neutral-800 p-3 active:cursor-grabbing"
			>
				<p className="text-sm text-neutral-100">{props.description}</p>
			</motion.div>
		</>
	);
};

export default KanbanCard;
