import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/features/sidebar";

const GoalExampleLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<SidebarProvider>
			<AppSidebar />
			<main className="min-w-0 flex-1">
				<SidebarTrigger />
				{children}
			</main>
		</SidebarProvider>
	);
};

export default GoalExampleLayout;
