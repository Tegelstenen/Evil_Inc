import "@/app/globals.css";

import { BackgroundDust } from "@/components/background-dust";
import { ReloadableLogoLink } from "@/components/reloadable-logo-link";

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<div className="flex w-full grow flex-col items-center justify-center sm:px-4">
			<BackgroundDust />
			<nav
				className={"top-0 left-0 grid w-full grid-cols-2 px-8 py-4 sm:fixed"}
				style={{ pointerEvents: "auto", zIndex: 50 }}
			>
				<div className={"flex"}>
					<ReloadableLogoLink id="layout-logo-link" />
				</div>
			</nav>
			{children}
		</div>
	);
}
