import "./globals.css";

import type { Metadata } from "next";
import { Toaster } from "sonner";

export const metadata: Metadata = {
	title: "Her",
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" className={"h-full w-full"}>
			<body className={"bg-black antialiased"}>
				{children}
				<Toaster />
			</body>
		</html>
	);
}
