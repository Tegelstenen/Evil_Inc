"use client";

import { AnimatePresence } from "framer-motion";
import { useState } from "react";

import {
	AuthStep,
	Code,
	Loading,
	OAuthProviders,
	SignInSelection,
} from "@/features/auth";
import { ActionResponse } from "@/features/shared";
import { signIn } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const mockSendMailOTP = async (email: string): Promise<ActionResponse> => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({ success: true, message: `OTP is sent to ${email}` });
		}, 10000);
	});
};

const AuthPage = () => {
	const [step, setStep] = useState<AuthStep>("selection");
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
			setStep("selection");
		}
	};

	const handleOauthSubmit = async (provider: OAuthProviders) => {
		setStep("loading");
		setLoadingMessage(`Signing in with ${provider}`);
		setIsError(false);
		await signIn.social(
			{
				provider: provider,
				callbackURL: "/dashboard",
			},
			{
				onError: (ctx) => {
					setIsError(true);
					setActionMessage(ctx.error.message);
					setStep("selection");
				},
			},
		);
	};

	return (
		<div
			className={cn(
				"flex min-h-screen w-full items-center justify-center overflow-hidden",
			)}
		>
			<div className="w-full max-w-sm">
				<AnimatePresence mode="wait">
					{step === "loading" && (
						<Loading key="loading" message={loadingMessage} isError={isError} />
					)}

					{step === "selection" && (
						<SignInSelection
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
