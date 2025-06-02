import { Suspense } from "react";

import { ProjectBox } from "@/features/projects";

const ProjectPage = ({ params }: { params: { id: string } }) => {
	return (
		<div className="flex h-full w-full items-center justify-center p-4">
			<Suspense fallback={<div>Loading...</div>}>
				<ProjectBox projectId={params.id} />
			</Suspense>
		</div>
	);
};

export default ProjectPage;
