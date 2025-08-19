import "./globals.css";

import type { Metadata } from "next";

import NavigationSidebar from "@/components/NavigationSidebar";
import StyledComponentsRegistry from "@/lib/registry";

export const metadata: Metadata = {
	title: "Evil Incorporated",
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" className={"h-full w-full"}>
			<body className={"bg-black antialiased"}>
				<StyledComponentsRegistry>
					<NavigationSidebar />
					{children}
				</StyledComponentsRegistry>
			</body>
		</html>
	);
}
