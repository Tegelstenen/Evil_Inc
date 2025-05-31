"use client";
import { Mail } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

type VerificationMessageProps = {
	handleResend: () => void;
	isLoading: boolean;
	email: string;
};

const VerificationMessage = (props: VerificationMessageProps) => {
	const [canResend, setCanResend] = useState(false);

	const startTimer = () => {
		setCanResend(false);
		setTimeout(() => {
			setCanResend(true);
		}, 10000);
	};

	useEffect(() => {
		startTimer();
	}, []);

	const handleResendClick = () => {
		props.handleResend();
		startTimer();
	};

	return (
		<div className="flex h-full w-full flex-col items-center justify-center">
			<div className="w-[320px] space-y-4">
				<div className="flex items-center justify-center">
					<Mail className="h-12 w-12 text-white/60" />
				</div>
				<h2 className="text-center text-2xl text-white">Check your inbox</h2>
				<p className="text-center text-white/60">
					Click the link we sent to{" "}
					<strong className="text-white">{props.email}</strong> to finish your
					account setup.
				</p>
				<Button
					onClick={handleResendClick}
					disabled={props.isLoading || !canResend}
					className="glow-on-hover flex w-full items-center justify-center gap-2 px-4 py-3 transition-colors"
				>
					Resend verification email
				</Button>
			</div>
		</div>
	);
};

export default VerificationMessage;
