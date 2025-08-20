import "./globals.css";

import type { Metadata } from "next";

import Navbar from "@/components/navbar/Navbar";

export const metadata: Metadata = {
	title: "Evil Incorporated",
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en">
			<body className="no-scrollbar">
				<Navbar />
				{children}
			</body>
		</html>
	);
}
