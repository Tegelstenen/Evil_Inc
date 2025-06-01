"use client";

import {
	ArrowRight,
	BookOpen,
	CheckCircle,
	ChevronDown,
	Clock,
	Target,
} from "lucide-react";
import { useState } from "react";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import { Goal, Milestone, MilestoneUpdate, SubtaskUpdate } from "../types";

interface GoalBoxProps {
	goal: Goal;
	milestones: Milestone[];
	onSubtaskUpdate: (update: SubtaskUpdate) => Promise<void>;
	onMilestoneUpdate: (update: MilestoneUpdate) => Promise<void>;
}

const GoalBox = (props: GoalBoxProps) => {
	const [expandedMilestone, setExpandedMilestone] = useState<number | null>(
		null,
	);

	const handleSubtaskToggle = async (
		milestoneId: number,
		subtaskId: string,
		currentCompleted: boolean,
	) => {
		try {
			await props.onSubtaskUpdate({
				milestoneId,
				subtaskId,
				completed: !currentCompleted,
			});
		} catch (error) {
			console.error("Failed to toggle subtask:", error);
		}
	};

	const handleMilestoneUpdate = (milestoneId: number, completed: boolean) => {
		props.onMilestoneUpdate({ milestoneId, completed });
	};

	return (
		<Card className="max-h-[80vh] w-[600px] overflow-y-auto">
			<CardHeader>
				<CardTitle>{props.goal.title}</CardTitle>
				<CardDescription>{props.goal.description}</CardDescription>
				<div className="text-muted-foreground mt-3 flex items-center gap-4 text-sm">
					<div className="flex items-center gap-1">
						<Target size={14} />
						<span>{new Date(props.goal.target_date).toLocaleDateString()}</span>
					</div>
					<div className="flex items-center gap-1">
						<Clock size={14} />
						<span>{props.goal.estimated_total_hours}h total</span>
					</div>
				</div>
			</CardHeader>

			<CardContent className="space-y-4">
				{props.milestones.map((milestone) => (
					<Card key={milestone.id} className="border-border">
						<CardContent className="p-4">
							{/* Milestone Header */}
							<div className="flex items-center justify-between">
								<button
									type="button"
									onClick={() => {
										handleMilestoneUpdate(milestone.id, !milestone.completed);
									}}
									className="hover:bg-muted cursor-pointer rounded-full p-1 transition-colors"
								>
									<CheckCircle
										size={20}
										className={`transition-colors duration-200 ${milestone.completed ? "text-green-500" : "text-muted-foreground"}`}
									/>
								</button>
								<button
									type="button"
									className="flex flex-1 cursor-pointer items-center justify-between border-none bg-transparent p-0 text-left"
									onClick={() => {
										setExpandedMilestone(
											expandedMilestone === milestone.id ? null : milestone.id,
										);
									}}
								>
									<div className="flex items-center gap-3">
										<div>
											<h3 className="font-medium">{milestone.title}</h3>
											<p className="text-muted-foreground text-sm">
												Due{" "}
												{new Date(
													milestone.expected_completion_date,
												).toLocaleDateString()}
											</p>
										</div>
									</div>
									<ChevronDown
										className={`text-muted-foreground transform transition-transform ${
											expandedMilestone === milestone.id ? "rotate-180" : ""
										}`}
									/>
								</button>
							</div>

							{/* Expanded Content */}
							{expandedMilestone === milestone.id && (
								<div className="border-border mt-4 space-y-4 border-t pt-4">
									<p className="text-muted-foreground text-sm">
										{milestone.description}
									</p>

									{/* Metrics */}
									{milestone.metrics && (
										<div className="bg-muted/50 rounded-md p-3">
											<h4 className="mb-2 text-sm font-medium">
												Success Metrics
											</h4>
											<p className="text-muted-foreground text-sm">
												{milestone.metrics.measurement}
												{milestone.metrics.target_value && (
													<span className="ml-1 font-medium">
														(Target: {milestone.metrics.target_value})
													</span>
												)}
											</p>
										</div>
									)}

									{/* Subtasks */}
									{milestone.subtasks && milestone.subtasks.length > 0 && (
										<div>
											<h4 className="mb-2 text-sm font-medium">Subtasks</h4>
											<div className="space-y-2">
												{milestone.subtasks.map((subtask) => (
													<div
														key={subtask.id}
														className="group bg-muted/50 hover:bg-muted flex items-center justify-between rounded-md p-2 text-sm transition-colors"
													>
														<div className="flex items-center gap-2">
															<button
																onClick={(e) => {
																	e.preventDefault();
																	handleSubtaskToggle(
																		milestone.id,
																		subtask.id,
																		subtask.completed,
																	);
																}}
																className="border-border hover:bg-muted cursor-pointer rounded-md border p-1"
															>
																<CheckCircle
																	size={16}
																	className={`transition-colors duration-200 ${subtask.completed ? "text-green-500" : "text-muted-foreground"}`}
																/>
															</button>
															<span
																className={`${subtask.completed ? "text-muted-foreground line-through" : ""}`}
															>
																{subtask.description}
															</span>
														</div>
														<span className="text-muted-foreground">
															{Math.round(
																(subtask.estimated_minutes / 60) * 10,
															) / 10}
															h
														</span>
													</div>
												))}
											</div>
										</div>
									)}

									{/* Resources */}
									{milestone.resources && milestone.resources.length > 0 && (
										<div>
											<h4 className="mb-2 text-sm font-medium">Resources</h4>
											<div className="space-y-2">
												{milestone.resources.map((resource) => (
													<div
														key={`${resource.type}-${resource.description}`}
														className="bg-muted/50 flex items-center gap-2 rounded-md p-2 text-sm"
													>
														<BookOpen
															size={14}
															className="text-muted-foreground"
														/>
														<span>{resource.description}</span>
													</div>
												))}
											</div>
										</div>
									)}

									{/* Prerequisites */}
									{milestone.prerequisites &&
										milestone.prerequisites.length > 0 && (
											<div>
												<h4 className="mb-2 text-sm font-medium">
													Prerequisites
												</h4>
												<div className="flex flex-wrap gap-2">
													{milestone.prerequisites.map((prereqId) => {
														const prereq = props.milestones.find(
															(m) => m.id === prereqId,
														);
														return (
															prereq && (
																<div
																	key={prereqId}
																	className="bg-muted/50 text-muted-foreground flex items-center gap-1 rounded-md p-2 text-sm"
																>
																	<ArrowRight size={14} />
																	<span>{prereq.title}</span>
																</div>
															)
														);
													})}
												</div>
											</div>
										)}
								</div>
							)}
						</CardContent>
					</Card>
				))}
			</CardContent>
		</Card>
	);
};

export default GoalBox;
