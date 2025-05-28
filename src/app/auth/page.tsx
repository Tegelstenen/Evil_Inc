"use client";

import { AnimatePresence } from "framer-motion";
import { useState } from "react";

import Code from "@/features/auth/components/code";
import Email from "@/features/auth/components/email";
import Loading from "@/features/auth/components/loading";
import { AuthStep } from "@/features/auth/types";
import { ActionResponse } from "@/features/shared/types";
import { cn } from "@/lib/utils";

const mockSendMailOTP = async (email: string): Promise<ActionResponse> => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({ success: true, message: `OTP is sent to ${email}` });
		}, 10000);
	});
};

const mockOauth = async (): Promise<ActionResponse> => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({
				success: false,
				message: "Failed to login",
				error: "Invalid credentials",
			});
		}, 4000);
	});
};

const AuthPage = () => {
	const [step, setStep] = useState<AuthStep>("email");
	const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
	const [actionMessage, setActionMessage] = useState<string | null>(null);
	const [isError, setIsError] = useState<boolean>(false);

	const handleEmailSubmit = async (email: string) => {
		setStep("loading");
		setLoadingMessage(`We're sending a code to ${email}`);
		setIsError(false);
		const result = await mockSendMailOTP(email);
		setActionMessage(result.message);
		if (result.success) {
			setStep("code");
		} else {
			console.error(result.error);
			setIsError(true);
			setStep("email");
		}
	};

	const handleOauthSubmit = async (provider: string) => {
		setStep("loading");
		setLoadingMessage(`Signing in with ${provider}`);
		setIsError(false);
		const result = await mockOauth();
		setActionMessage(result.message);
	};

	// // Expose step state to window object for DevTools access
	// useEffect(() => {
	// 	(window as any).__AUTH_STEP = {
	// 		setStep: (newStep: AuthStep) => setStep(newStep),
	// 		setMessage: (message: string) => setActionMessage(message)
	// 	};
	// }, [step]);

	return (
		<div className={cn("flex min-h-screen w-full items-center justify-center")}>
			<div className="w-full max-w-sm">
				<AnimatePresence mode="wait">
					{step === "loading" && (
						<Loading key="loading" message={loadingMessage} isError={isError} />
					)}

					{step === "email" && (
						<Email
							key="email-step"
							handleEmailSubmit={handleEmailSubmit}
							handleOauthSubmit={handleOauthSubmit}
							actionMessage={actionMessage}
						/>
					)}

					{step === "code" && (
						<Code
							key="code-step"
							setStep={setStep}
							setActionMessage={setActionMessage}
						/>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
};

export default AuthPage;
