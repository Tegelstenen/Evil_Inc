"use client";

import { addDays, differenceInDays, format, parseISO, subDays } from "date-fns";
import {
	AlertCircle,
	Calendar,
	CheckCircle,
	EyeIcon,
	LinkIcon,
	TrashIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";

// Import your mock data
import { mockGetProject } from "../services/get-milestones";
// Import your types
import { Milestone, Tasks, TaskStatus } from "../types";
import {
	GanttCreateMarkerTrigger,
	type GanttFeature,
	GanttFeatureItem,
	GanttFeatureList,
	GanttFeatureListGroup,
	GanttHeader,
	GanttMarker,
	GanttMarkerProps,
	GanttProvider,
	GanttSidebar,
	GanttSidebarGroup,
	GanttSidebarItem,
	type GanttStatus,
	GanttTimeline,
	GanttToday,
} from "./gantt";

const today = new Date();

// Status mappings for tasks
const taskStatusMap: Record<TaskStatus, GanttStatus> = {
	todo: { id: "todo", name: "To Do", color: "#6B7280" },
	in_progress: { id: "in_progress", name: "In Progress", color: "#F59E0B" },
	done: { id: "done", name: "Done", color: "#10B981" },
	blocked: { id: "blocked", name: "Blocked", color: "#EF4444" },
};

// Convert milestone to gantt feature
const milestoneToGanttFeature = (milestone: Milestone): GanttFeature => {
	const startDate = parseISO(milestone.start_date);
	const endDate = parseISO(milestone.expected_completion_date);

	return {
		id: milestone.id,
		name: milestone.title,
		startAt: startDate,
		endAt: endDate,
		status: milestone.completed
			? taskStatusMap.done
			: new Date(milestone.expected_completion_date) < today &&
				  !milestone.completed
				? taskStatusMap.blocked
				: taskStatusMap.in_progress,
	};
};

// Convert task to gantt feature with smart date calculation
const taskToGanttFeature = (
	task: Tasks,
	milestoneId: string,
	milestoneStartDate: Date,
	milestoneEndDate: Date,
	taskIndex: number,
	totalTasks: number,
): GanttFeature => {
	// Use days_span for task duration instead of converting from minutes
	const taskDuration = task.days_span;

	// Calculate position within milestone
	const milestoneDuration = differenceInDays(
		milestoneEndDate,
		milestoneStartDate,
	);
	const taskStartOffset = Math.floor(
		(taskIndex / totalTasks) * milestoneDuration,
	);
	const taskStartDate = addDays(milestoneStartDate, taskStartOffset);
	const taskEndDate = addDays(taskStartDate, taskDuration);

	return {
		id: `${milestoneId}-${task.id}`,
		name: task.description,
		startAt: taskStartDate,
		endAt: taskEndDate,
		status: taskStatusMap[task.status],
	};
};

// Convert milestones and tasks to gantt structure
const convertMilestonesToGanttData = (milestones: Milestone[]) => {
	const ganttFeatures: GanttFeature[] = [];
	const groups: Record<string, { name: string; items: GanttFeature[] }> = {};

	milestones.forEach((milestone) => {
		const milestoneFeature = milestoneToGanttFeature(milestone);

		// Add tasks if they exist
		if (milestone.tasks.length > 0) {
			const taskGroupName = milestone.title;
			if (!groups[taskGroupName]) {
				groups[taskGroupName] = { name: taskGroupName, items: [] };
			}

			milestone.tasks.forEach((task, index) => {
				const taskFeature = taskToGanttFeature(
					task,
					milestone.id,
					milestoneFeature.startAt,
					milestoneFeature.endAt,
					index,
					milestone.tasks.length,
				);
				ganttFeatures.push(taskFeature);
				groups[taskGroupName].items.push(taskFeature);
			});
		}
	});

	return { features: ganttFeatures, groups };
};

// Generate smart markers based on milestones
const generateMarkersFromMilestones = (milestones: Milestone[]) => {
	const markers = [];

	// Add project start marker
	if (milestones.length > 0) {
		const earliestDate = milestones.reduce((earliest, milestone) => {
			const milestoneDate = parseISO(milestone.expected_completion_date);
			const estimatedStart = subDays(
				milestoneDate,
				Math.ceil((milestone.estimated_hours ?? 8) / 8),
			);
			return estimatedStart < earliest ? estimatedStart : earliest;
		}, parseISO(milestones[0].expected_completion_date));

		markers.push({
			id: "project-start",
			date: earliestDate,
			label: "Project Start",
			className: "bg-blue-100 text-blue-900",
		});
	}

	// Add milestone markers
	milestones.forEach((milestone, index) => {
		markers.push({
			id: `milestone-${milestone.id}`,
			date: parseISO(milestone.expected_completion_date),
			label: `M${index + 1}: ${milestone.title}`,
			className: milestone.completed
				? "bg-green-100 text-green-900"
				: new Date(milestone.expected_completion_date) < today
					? "bg-red-100 text-red-900"
					: "bg-purple-100 text-purple-900",
		});
	});

	return markers;
};

interface MilestoneGanttProps {
	projectId: string;
}

const MilestoneGantt = ({ projectId }: MilestoneGanttProps) => {
	const [milestones, setMilestones] = useState<Milestone[]>([]);
	const [ganttData, setGanttData] = useState<{
		features: GanttFeature[];
		groups: Record<string, { name: string; items: GanttFeature[] }>;
	}>({ features: [], groups: {} });
	const [markers, setMarkers] = useState<GanttMarkerProps[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(
		null,
	);

	// Load milestones on component mount
	useEffect(() => {
		const loadMilestones = async () => {
			try {
				setLoading(true);
				const data = await mockGetProject(projectId);
				setMilestones(data.milestones);
				const converted = convertMilestonesToGanttData(data.milestones);
				setGanttData(converted);
				setMarkers(generateMarkersFromMilestones(data.milestones));
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Failed to load milestones",
				);
				console.error("Failed to load milestones:", err);
			} finally {
				setLoading(false);
			}
		};

		loadMilestones();
	}, [projectId]);

	const getFeatureDetails = (id: string) => {
		const milestone = milestones.find((m) => m.id === id);
		if (milestone) {
			return { type: "milestone" as const, data: milestone };
		}

		for (const m of milestones) {
			const task = m.tasks.find((t) => `${m.id}-${t.id}` === id);
			if (task) {
				return { type: "task" as const, data: task, milestone: m };
			}
		}
		return null;
	};

	const handleViewFeature = (id: string) => {
		const details = getFeatureDetails(id);
		if (details) {
			if (details.type === "milestone") {
				setSelectedMilestoneId(selectedMilestoneId === id ? null : id);
			} else {
				console.log(`Selected ${details.type}:`, details.data);
				if (details.type === "task") {
					console.log("From milestone:", details.milestone?.title);
				}
			}
		}
	};

	const handleCopyLink = (id: string) => {
		const url = `${window.location.origin}/project/${projectId}?feature=${id}`;
		navigator.clipboard.writeText(url);
		console.log(`Copied link: ${url}`);
	};

	const handleRemoveFeature = (id: string) => {
		setGanttData((prev) => ({
			...prev,
			features: prev.features.filter((feature) => feature.id !== id),
		}));

		// Also update the underlying data
		const details = getFeatureDetails(id);
		if (details?.type === "milestone") {
			setMilestones((prev) => prev.filter((m) => m.id !== id));
		} else if (details?.type === "task") {
			setMilestones((prev) =>
				prev.map((m) => ({
					...m,
					tasks: m.tasks.filter((t) => `${m.id}-${t.id}` !== id),
				})),
			);
		}
	};

	const handleMoveFeature = (id: string, startAt: Date, endAt: Date | null) => {
		if (!endAt) return;

		setGanttData((prev) => ({
			...prev,
			features: prev.features.map((feature) =>
				feature.id === id ? { ...feature, startAt, endAt } : feature,
			),
		}));

		// Update underlying data
		const details = getFeatureDetails(id);
		if (details?.type === "milestone") {
			setMilestones((prev) =>
				prev.map((milestone) =>
					milestone.id === id
						? {
								...milestone,
								expected_completion_date: format(endAt, "yyyy-MM-dd"),
							}
						: milestone,
				),
			);
		}
	};

	const handleAddFeature = (date: Date) => {
		console.log(`Add new item at: ${format(date, "yyyy-MM-dd")}`);
		// Implement logic to add new milestone or task
	};

	const handleCreateMarker = (date: Date) => {
		const newMarker = {
			id: `custom-${Date.now()}`,
			date,
			label: `Custom Marker`,
			className: "bg-gray-100 text-gray-900",
		};
		setMarkers((prev) => [...prev, newMarker]);
	};

	const handleRemoveMarker = (id: string) => {
		setMarkers((prev) => prev.filter((marker) => marker.id !== id));
	};

	if (loading) {
		return (
			<div className="flex h-64 items-center justify-center">
				<div className="text-center">
					<div className="border-primary mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2"></div>
					<p>Loading project timeline...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex h-64 items-center justify-center">
				<div className="text-center text-red-600">
					<AlertCircle className="mx-auto mb-2 h-8 w-8" />
					<p>Error: {error}</p>
				</div>
			</div>
		);
	}

	if (ganttData.features.length === 0) {
		return (
			<div className="flex h-64 items-center justify-center">
				<div className="text-muted-foreground text-center">
					<Calendar className="mx-auto mb-2 h-8 w-8" />
					<p>No timeline data available</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{/* Gantt Chart */}
			<GanttProvider
				onAddItem={handleAddFeature}
				range="monthly"
				zoom={100}
				className="h-[600px] rounded-lg border"
			>
				<GanttSidebar>
					{Object.entries(ganttData.groups).map(([groupName, group]) => (
						<GanttSidebarGroup key={groupName} name={group.name}>
							{group.items.map((feature) => {
								const details = getFeatureDetails(feature.id);
								return (
									<GanttSidebarItem
										key={feature.id}
										feature={feature}
										onSelectItem={handleViewFeature}
										className={`${details?.type === "milestone" ? "font-medium" : ""}`}
									/>
								);
							})}
						</GanttSidebarGroup>
					))}
				</GanttSidebar>

				<GanttTimeline>
					<GanttHeader />
					<GanttFeatureList>
						{Object.entries(ganttData.groups).map(([groupName, group]) => (
							<GanttFeatureListGroup key={groupName}>
								{group.items.map((feature) => {
									const details = getFeatureDetails(feature.id);
									const isOverdue =
										feature.endAt < today && feature.status.id !== "done";

									return (
										<div className="flex" key={feature.id}>
											<ContextMenu>
												<ContextMenuTrigger asChild>
													<button
														type="button"
														onClick={() => handleViewFeature(feature.id)}
														className="w-full"
													>
														<GanttFeatureItem
															onMove={handleMoveFeature}
															{...feature}
															className={isOverdue ? "animate-pulse" : ""}
														>
															<div className="flex flex-1 items-center gap-2">
																<div
																	className="h-2 w-2 flex-shrink-0 rounded-full"
																	style={{
																		backgroundColor: feature.status.color,
																	}}
																/>
																<p className="flex-1 truncate text-left text-xs">
																	{feature.name}
																</p>
																{details?.type === "milestone" && (
																	<Badge variant="outline" className="text-xs">
																		M
																	</Badge>
																)}
																{isOverdue && (
																	<AlertCircle className="h-3 w-3 flex-shrink-0 text-red-500" />
																)}
																{feature.status.id === "done" && (
																	<CheckCircle className="h-3 w-3 flex-shrink-0 text-green-500" />
																)}
															</div>
														</GanttFeatureItem>
													</button>
												</ContextMenuTrigger>
												<ContextMenuContent>
													<ContextMenuItem
														className="flex items-center gap-2"
														onClick={() => handleViewFeature(feature.id)}
													>
														<EyeIcon
															size={16}
															className="text-muted-foreground"
														/>
														View {details?.type || "item"}
													</ContextMenuItem>
													<ContextMenuItem
														className="flex items-center gap-2"
														onClick={() => handleCopyLink(feature.id)}
													>
														<LinkIcon
															size={16}
															className="text-muted-foreground"
														/>
														Copy link
													</ContextMenuItem>
													<ContextMenuItem
														className="text-destructive flex items-center gap-2"
														onClick={() => handleRemoveFeature(feature.id)}
													>
														<TrashIcon size={16} />
														Remove from timeline
													</ContextMenuItem>
												</ContextMenuContent>
											</ContextMenu>
										</div>
									);
								})}
							</GanttFeatureListGroup>
						))}
					</GanttFeatureList>

					{markers.map((marker) => (
						<GanttMarker
							key={marker.id}
							{...marker}
							onRemove={
								marker.id.startsWith("custom-") ? handleRemoveMarker : undefined
							}
						/>
					))}

					<GanttToday />
					<GanttCreateMarkerTrigger onCreateMarker={handleCreateMarker} />
				</GanttTimeline>
			</GanttProvider>
		</div>
	);
};

export default MilestoneGantt;
