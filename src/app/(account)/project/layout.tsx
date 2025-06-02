import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/features/sidebar";

const GoalExampleLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarTrigger />
			<div className="h-screen w-full">{children}</div>
		</SidebarProvider>
	);
};

export default GoalExampleLayout;
