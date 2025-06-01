"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";

const DashboardPage = () => {
	const router = useRouter();

	const handleSignout = () => {
		signOut(
			{},
			{
				onSuccess: () => {
					router.push("/");
				},
			},
		);
	};

	return (
		<motion.div
			initial={{ opacity: 0, x: 100 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -100 }}
			transition={{ duration: 0.4, ease: "easeOut" }}
			className="fixed inset-0 flex items-center justify-center overflow-hidden"
		>
			<div className="flex flex-col items-center justify-center gap-4">
				<h1 className="text-2xl font-bold text-white">Dashboard</h1>
				<Button onClick={handleSignout}>Sign Out</Button>
			</div>
		</motion.div>
	);
};

export default DashboardPage;
