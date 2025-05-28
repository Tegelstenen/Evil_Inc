import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import BoxSpinner from "@/features/shared/components/suspense-animations";

interface SuspenseProps {
	message: string | null;
	isError?: boolean;
}

const Loading = (props: SuspenseProps) => {
	const [showMessage, setShowMessage] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => {
			setShowMessage(true);
		}, 1000);
		return () => clearTimeout(timer);
	}, []);

	return (
		<motion.div
			key="suspense-view"
			initial={{ opacity: 0, x: 100 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: props.isError ? -100 : 100 }}
			transition={{ duration: 0.4, ease: "easeOut" }}
			className="flex min-h-screen flex-col items-center justify-center text-center"
		>
			<motion.div
				className="flex justify-center"
				animate={{
					y: showMessage ? -40 : 0,
				}}
				transition={{
					duration: 0.8,
					ease: "easeInOut",
				}}
			>
				<BoxSpinner />
			</motion.div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{
					opacity: showMessage ? 1 : 0,
					y: showMessage ? 0 : 20,
				}}
				transition={{
					duration: 0.8,
					ease: "easeOut",
					delay: showMessage ? 0.3 : 0,
				}}
			>
				<p className="text-[2.5rem] leading-[1.1] font-bold tracking-tight text-white">
					{props.message}
				</p>
			</motion.div>
		</motion.div>
	);
};

export default Loading;
