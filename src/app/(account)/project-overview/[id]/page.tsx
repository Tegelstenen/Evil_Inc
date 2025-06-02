import { Suspense } from "react";

import {
	KanbanBoard,
	MilestoneGantt,
	mockGetProject,
	ProjectInfo,
} from "@/features/project";

const ProjectPage = async ({ params }: { params: { id: string } }) => {
	const project = await mockGetProject(params.id);
	return (
		<div className="flex h-full w-full flex-col px-7">
			{/* Project Info and Kanban Board Section */}
			<div className="mb-6 flex gap-6">
				<div className="w-1/2">
					<Suspense fallback={<div>Loading project info...</div>}>
						<ProjectInfo
							title={project.title}
							description={project.description}
							context={project.context}
							target_date={project.target_date}
							estimated_hours={project.estimated_hours}
							success_criteria={project.success_criteria}
						/>
					</Suspense>
				</div>
				<div className="w-1/2">
					<Suspense fallback={<div>Loading kanban board...</div>}>
						<KanbanBoard />
					</Suspense>
				</div>
			</div>
			<Suspense fallback={<div>Loading gantt chart...</div>}>
				<MilestoneGantt projectId={params.id} />
			</Suspense>
		</div>
	);
};

export default ProjectPage;
