import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { Spinner } from "@/components/ui/spinner";
import { ActionResponse } from "@/features/shared/types";

import { AuthStep, OTP_LENGTH } from "../types";

const mockCheckOTP = async (code: string): Promise<ActionResponse> => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({
				success: false,
				message: `${code} is invalid`,
				error: "rate limit",
			});
		}, 3000);
	});
};

const mockResendOTP = async (): Promise<ActionResponse> => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({
				success: false,
				message: "Code is invalid",
				error: "rate limit",
			});
		}, 3000);
	});
};

interface CodeProps {
	setStep: (step: AuthStep) => void;
	setActionMessage: (message: string | null) => void;
}

const Code = (props: CodeProps) => {
	const [code, setCode] = useState("");
	const [isChecking, setIsChecking] = useState(false);
	const [isResending, setIsResending] = useState(false);
	const [wrongCode, setWrongCode] = useState<boolean>(false);

	const handleCheckCode = async () => {
		setIsChecking(true);
		const result = await mockCheckOTP(code);
		if (result.success) {
			props.setStep("loading");
			// props.setStep("success");
			// const firstTime = true;
			// if (firstTime) {
			// 	props.setStep("personal");
			// } else {
			// 	props.setStep("success");
			// }
		} else {
			setWrongCode(true);
			if (result.error == "rate limit") {
				toast.error("Rate limit exceeded, please try again later");
			}
		}
		setIsChecking(false);
	};

	const handleResendCode = async () => {
		setIsResending(true);
		setCode("");
		setWrongCode(false);
		const result = await mockResendOTP();
		if (result.error == "rate limit") {
			toast.error("Rate limit exceeded, please try again later");
			setWrongCode(true);
		}
		setIsResending(false);
	};

	const handleGoBack = () => {
		props.setActionMessage(null);
		props.setStep("email");
	};

	return (
		<motion.div
			key="code-step"
			initial={{ opacity: 0, x: 100 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: 100 }}
			transition={{ duration: 0.4, ease: "easeOut" }}
			className="space-y-6 text-center"
		>
			<div className="space-y-1">
				<h1 className="text-[2.5rem] leading-[1.1] font-bold tracking-tight text-white">
					Check your email
				</h1>
				<p className="text-[1.25rem] font-light text-white/50">
					We sent you a code
				</p>
			</div>

			<div className="flex w-full justify-center">
				<InputOTP
					maxLength={6}
					value={code}
					disabled={isResending || isChecking}
					onChange={(value) => {
						setCode(value);
						if (wrongCode) setWrongCode(false);
					}}
				>
					<InputOTPGroup>
						<InputOTPSlot index={0} aria-invalid={wrongCode} />
						<InputOTPSlot index={1} aria-invalid={wrongCode} />
						<InputOTPSlot index={2} aria-invalid={wrongCode} />
					</InputOTPGroup>
					<InputOTPSeparator className="text-white/50" />
					<InputOTPGroup>
						<InputOTPSlot index={3} aria-invalid={wrongCode} />
						<InputOTPSlot index={4} aria-invalid={wrongCode} />
						<InputOTPSlot index={5} aria-invalid={wrongCode} />
					</InputOTPGroup>
				</InputOTP>
			</div>

			<div>
				<motion.p
					className={`cursor-pointer text-sm text-white/50 transition-colors hover:text-white/70 ${isResending || isChecking ? "pointer-events-none cursor-not-allowed opacity-50" : ""}`}
					whileHover={
						isResending || isChecking ? { scale: 1 } : { scale: 1.02 }
					}
					transition={{ duration: 0.2 }}
					onClick={() => handleResendCode()}
				>
					{isResending ? (
						<Spinner size="small" className="text-white/50" />
					) : (
						"Resend code"
					)}
				</motion.p>
			</div>

			<div className="flex w-full gap-3">
				<motion.button
					onClick={() => handleGoBack()}
					className="w-[30%] rounded-full bg-white px-8 py-3 font-medium text-black transition-colors hover:bg-white/90"
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					transition={{ duration: 0.2 }}
				>
					Back
				</motion.button>

				<motion.button
					className={`flex-1 rounded-full border py-3 font-medium transition-all duration-300 ${
						code.length === OTP_LENGTH && !isChecking && !wrongCode
							? "cursor-pointer border-transparent bg-white text-black hover:bg-white/90"
							: "cursor-not-allowed border-white/10 bg-[#111] text-white/50"
					}`}
					disabled={code.length !== OTP_LENGTH || isChecking || wrongCode}
					onClick={() => {
						setIsChecking(true);
						handleCheckCode();
					}}
				>
					{isChecking ? (
						<Spinner size="small" className="text-black" />
					) : (
						"Continue"
					)}
				</motion.button>
			</div>
		</motion.div>
	);
};

export default Code;
