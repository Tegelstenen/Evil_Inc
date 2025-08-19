"use client";

import { useRouter } from "next/navigation";

import Button from "@/features/hero/components/SidebarButton";

export default function NavigationSidebar() {
	const router = useRouter();

	return (
		<div className="fixed top-0 left-0 z-20 flex h-full w-48 flex-col items-start justify-center bg-black px-4 py-8">
			<Button onClick={() => router.push("/originals")}>Originals</Button>
			<Button onClick={() => router.push("/prints")}>Prints</Button>
			<Button onClick={() => router.push("/about")}>About</Button>
		</div>
	);
}
