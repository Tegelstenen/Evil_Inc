import { Suspense } from "react";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
} from "@/components/ui/sidebar";

import {
	ProjectSidebarLinks,
	SuspenseProjectSidebarLinks,
} from "./project-sidebar-links";

const AppSidebar = () => {
	return (
		<Sidebar>
			<SidebarHeader />
			<SidebarContent>
				<SidebarGroup>
					<SidebarMenu>
						<Suspense fallback={<SuspenseProjectSidebarLinks />}>
							<ProjectSidebarLinks />
						</Suspense>
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter />
		</Sidebar>
	);
};

export default AppSidebar;
