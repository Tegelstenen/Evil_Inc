import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { ChevronRight, Goal } from "lucide-react";
import Link from "next/link";

import {
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";

// TODO: replace with actual API call to db to gett all names + ids of a users projects
const mockGetProjectsNames = async () => {
	return (
		await new Promise((resolve) => setTimeout(resolve, 1000)),
		[
			{
				id: "1",
				name: "Project 1",
			},
			{
				id: "2",
				name: "Project 2",
			},
		]
	);
};

const SuspenseProjectSidebarLinks = () => {
	return (
		<SidebarMenuItem>
			<SidebarMenuButton tooltip={"projects"}>
				<Spinner className="size-4" />
				<span>Projects</span>
			</SidebarMenuButton>
		</SidebarMenuItem>
	);
};

const ProjectSidebarLinks = async () => {
	const projects = await mockGetProjectsNames();

	return (
		<Collapsible
			key="projects"
			asChild
			defaultOpen={false}
			className="group/collapsible"
		>
			<SidebarMenuItem>
				<CollapsibleTrigger asChild>
					<SidebarMenuButton tooltip={"projects"}>
						<Goal />
						<span>Projects</span>
						<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
					</SidebarMenuButton>
				</CollapsibleTrigger>
				<CollapsibleContent>
					<SidebarMenuSub>
						{projects.map((project) => (
							<SidebarMenuSubItem key={project.id}>
								<SidebarMenuSubButton asChild>
									<Link
										key={project.id}
										className="text-muted-foreground text-sm"
										href={`/project/${project.id}`}
									>
										{project.name}
									</Link>
								</SidebarMenuSubButton>
							</SidebarMenuSubItem>
						))}
					</SidebarMenuSub>
				</CollapsibleContent>
			</SidebarMenuItem>
		</Collapsible>
	);
};

export { ProjectSidebarLinks, SuspenseProjectSidebarLinks };
