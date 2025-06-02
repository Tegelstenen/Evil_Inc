import {
	BookOpen,
	CheckCircle,
	ChevronDown,
	Clock,
	Lightbulb,
	Target,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { mockGetProject } from "../services";
import { Insight, Issues, Milestone, Priority, Resource } from "../types";

interface ProjectBoxProps {
	projectId: string;
}

const ProjectBox = async (props: ProjectBoxProps) => {
	const project = await mockGetProject(props.projectId);

	const getPriorityColor = (priority: Priority) => {
		switch (priority) {
			case "high":
				return "text-red-500";
			case "medium":
				return "text-yellow-500";
			case "low":
				return "text-blue-500";
			default:
				return "text-muted-foreground";
		}
	};

	return (
		<Card className="max-h-[80vh] w-[600px] overflow-y-auto">
			<CardHeader>
				<CardTitle>{project.title}</CardTitle>
				<CardDescription>{project.description}</CardDescription>
				<div className="text-muted-foreground mt-3 flex items-center gap-4 text-sm">
					<div className="flex items-center gap-1">
						<Target size={14} />
						<span>{new Date(project.target_date).toLocaleDateString()}</span>
					</div>
					<div className="flex items-center gap-1">
						<Clock size={14} />
						<span>{project.estimated_hours}h total</span>
					</div>
				</div>
				{project.context && (
					<div className="text-muted-foreground mt-2 text-sm">
						<h4 className="font-medium">Context</h4>
						<p>{project.context}</p>
					</div>
				)}
				{project.success_criteria && project.success_criteria.length > 0 && (
					<div className="mt-2">
						<h4 className="text-sm font-medium">Success Criteria</h4>
						<ul className="text-muted-foreground mt-1 list-inside list-disc text-sm">
							{project.success_criteria.map((criteria, index) => (
								<li key={index}>{criteria}</li>
							))}
						</ul>
					</div>
				)}
			</CardHeader>

			<CardContent className="space-y-4">
				{project.milestones.map((milestone: Milestone) => (
					<Card key={milestone.id} className="border-border">
						<CardContent className="p-4">
							<Collapsible>
								<div className="flex items-center justify-between">
									<Button
										variant="ghost"
										size="icon"
										className="hover:bg-muted"
									>
										<CheckCircle
											size={20}
											className={`transition-colors duration-200 ${milestone.completed ? "text-green-500" : "text-muted-foreground"}`}
										/>
									</Button>
									<CollapsibleTrigger asChild>
										<Button
											variant="ghost"
											className="flex flex-1 items-center justify-between p-0 text-left"
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
											<div className="flex items-center gap-2">
												<span
													className={`text-sm ${getPriorityColor(milestone.priority)}`}
												>
													{milestone.priority}
												</span>
												<ChevronDown className="text-muted-foreground transform transition-transform data-[state=open]:rotate-180" />
											</div>
										</Button>
									</CollapsibleTrigger>
								</div>

								<CollapsibleContent className="border-border mt-4 space-y-4 border-t pt-4">
									<p className="text-muted-foreground text-sm">
										{milestone.description}
									</p>

									{/* Time Estimates */}
									{(milestone.estimated_hours || milestone.current_hours) && (
										<div className="bg-muted/50 rounded-md p-3">
											<h4 className="mb-2 text-sm font-medium">
												Time Estimates
											</h4>
											<div className="text-muted-foreground text-sm">
												{milestone.estimated_hours && (
													<p>Estimated: {milestone.estimated_hours}h</p>
												)}
												{milestone.current_hours && (
													<p>Current: {milestone.current_hours}h</p>
												)}
											</div>
										</div>
									)}

									{/* Issues/Subtasks */}
									{milestone.issues && milestone.issues.length > 0 && (
										<div>
											<h4 className="mb-2 text-sm font-medium">Subtasks</h4>
											<div className="space-y-2">
												{milestone.issues.map((subtask: Issues) => (
													<div
														key={subtask.id}
														className="group bg-muted/50 hover:bg-muted flex items-center justify-between rounded-md p-2 text-sm transition-colors"
													>
														<div className="flex items-center gap-2">
															<Button
																variant="outline"
																size="icon"
																className="h-7 w-7"
															>
																<CheckCircle
																	size={16}
																	className={`transition-colors duration-200 ${subtask.completed ? "text-green-500" : "text-muted-foreground"}`}
																/>
															</Button>
															<div className="flex flex-col">
																<span
																	className={`${subtask.completed ? "text-muted-foreground line-through" : ""}`}
																>
																	{subtask.description}
																</span>
																<div className="text-muted-foreground flex items-center gap-2 text-xs">
																	<span
																		className={getPriorityColor(
																			subtask.priority,
																		)}
																	>
																		{subtask.priority}
																	</span>
																	<span>•</span>
																	<span>{subtask.status}</span>
																</div>
															</div>
														</div>
														<div className="flex items-center gap-2">
															<span className="text-muted-foreground">
																{Math.round(
																	(subtask.estimated_minutes / 60) * 10,
																) / 10}
																h
															</span>
															{subtask.actual_minutes && (
																<span className="text-muted-foreground">
																	(Actual:{" "}
																	{Math.round(
																		(subtask.actual_minutes / 60) * 10,
																	) / 10}
																	h)
																</span>
															)}
														</div>
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
												{milestone.resources.map((resource: Resource) => (
													<a
														key={`${resource.type}-${resource.description}`}
														href={resource.url}
														target="_blank"
														rel="noopener noreferrer"
														className="bg-muted/50 hover:bg-muted flex items-center gap-2 rounded-md p-2 text-sm transition-colors"
													>
														<BookOpen
															size={14}
															className="text-muted-foreground"
														/>
														<span>{resource.description}</span>
													</a>
												))}
											</div>
										</div>
									)}

									{/* Insights */}
									{milestone.insights && milestone.insights.length > 0 && (
										<div>
											<h4 className="mb-2 text-sm font-medium">Insights</h4>
											<div className="space-y-2">
												{milestone.insights.map((insight: Insight) => (
													<div
														key={insight.id}
														className="bg-muted/50 flex items-start gap-2 rounded-md p-2 text-sm"
													>
														<Lightbulb
															size={14}
															className="text-muted-foreground mt-1"
														/>
														<div>
															<p>{insight.content}</p>
															<p className="text-muted-foreground mt-1 text-xs">
																{new Date(insight.date).toLocaleDateString()}
															</p>
														</div>
													</div>
												))}
											</div>
										</div>
									)}
								</CollapsibleContent>
							</Collapsible>
						</CardContent>
					</Card>
				))}
			</CardContent>
		</Card>
	);
};

export default ProjectBox;
