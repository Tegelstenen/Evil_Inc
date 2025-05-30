import { motion } from "framer-motion";
import { useState } from "react";
import { siGithub, siGoogle, siMeta } from "simple-icons";

import { OAuthProviders } from "../types";
import Terms from "./terms";

const iconMap = {
	google: siGoogle,
	facebook: siMeta,
	github: siGithub,
} as const;

interface EmailProps {
	handleEmailSubmit: (email: string) => void;
	handleOauthSubmit: (provider: OAuthProviders) => void;
	actionMessage?: string | null;
}

const SignInSelection = (props: EmailProps) => {
	const [email, setEmail] = useState("");

	return (
		<motion.div
			key="email-step"
			initial={{ opacity: 0, x: 100 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -100 }}
			transition={{ duration: 0.4, ease: "easeOut" }}
			className="space-y-6 text-center"
		>
			{props.actionMessage && (
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					className="text-sm text-red-400"
				>
					{props.actionMessage}
				</motion.div>
			)}

			<div className="space-y-4">
				{Object.entries(iconMap).map(([provider]) => (
					<div className="flex w-full justify-center" key={provider}>
						<button
							onClick={() =>
								props.handleOauthSubmit(provider as OAuthProviders)
							}
							className="glow-on-hover flex w-[320px] items-center justify-center gap-2 px-4 py-3 transition-colors"
						>
							<div className="flex items-center gap-2">
								<svg
									aria-hidden="true"
									viewBox="0 0 24 24"
									className="h-5 w-5 flex-shrink-0"
									fill="currentColor"
									dangerouslySetInnerHTML={{
										__html: iconMap[provider as keyof typeof iconMap].svg,
									}}
								/>
								<span>
									Sign in with{" "}
									{provider.charAt(0).toUpperCase() + provider.slice(1)}
								</span>
							</div>
						</button>
					</div>
				))}

				<div className="flex items-center gap-4">
					<div className="h-px flex-1 bg-white/10" />
					<span className="text-sm text-white/40">or</span>
					<div className="h-px flex-1 bg-white/10" />
				</div>

				<form
					onSubmit={(e) => {
						e.preventDefault();
						props.handleEmailSubmit(email);
					}}
				>
					<div className="glow-on-focus relative">
						<input
							type="email"
							placeholder="info@gmail.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full border-1 border-white/10 px-4 py-3 text-center text-white backdrop-blur-[1px] focus:border focus:border-white/30 focus:outline-none"
							required
						/>
						<button
							type="submit"
							className="group absolute top-1/2 right-1.5 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
						>
							<span className="relative block h-full w-full overflow-hidden">
								<span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-full">
									→
								</span>
								<span className="absolute inset-0 flex -translate-x-full items-center justify-center transition-transform duration-300 group-hover:translate-x-0">
									→
								</span>
							</span>
						</button>
					</div>
				</form>
			</div>
			<Terms />
		</motion.div>
	);
};

export default SignInSelection;
