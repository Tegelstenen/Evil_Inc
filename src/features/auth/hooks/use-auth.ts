"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import {
	sendOtp,
	sendVerificationEmail,
	signIn,
	signOut,
	signUp,
	updateUser,
	useSession,
	verify,
} from "@/lib/auth-client";

import { OAuthProviders, SignInData, SignUpData } from "../types";
import { useStoredEmail } from "./use-stored-email";

export const useAuth = () => {
	const [loadingAction, setLoadingAction] = useState<
		OAuthProviders | "email" | null
	>(null);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();
	const { saveEmail } = useStoredEmail();
	const { data: session, refetch } = useSession();

	const isLoading = loadingAction !== null;
	const isSelectedProvider = (action: OAuthProviders | "email") =>
		loadingAction === action;

	const handleOauthSignin = async (provider: OAuthProviders) => {
		setError(null);
		setLoadingAction(provider);
		await signIn.social(
			{
				provider: provider,
				callbackURL: "/dashboard",
			},
			{
				onError: (ctx) => {
					setError(ctx.error.message);
					setLoadingAction(null);
				},
			},
		);
	};

	const handleEmailSignIn = async (data: SignInData) => {
		setError(null);
		setLoadingAction("email");
		try {
			await signIn.email(
				{
					email: data.email,
					password: data.password,
				},
				{
					onError: async (ctx) => {
						if (ctx.error.status === 403) {
							await saveEmail(data.email);
							router.push(`/verify-email`);
						} else {
							setError(ctx.error.message);
							setLoadingAction(null);
						}
					},
					onSuccess: () => {
						router.push("/dashboard");
					},
				},
			);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to sign in");
			setLoadingAction(null);
		}
	};

	const handleEmailSignUp = async (data: SignUpData) => {
		setError(null);
		setLoadingAction("email");
		try {
			await signUp.email(
				{
					email: data.email,
					password: data.password,
					name: "temp",
				},
				{
					onError: (ctx) => {
						setError(ctx.error.message);
						setLoadingAction(null);
					},
					onSuccess: async () => {
						await saveEmail(data.email);
						router.push(`/verify-email`);
					},
				},
			);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to sign up");
			setLoadingAction(null);
		}
	};

	const handleSignOut = async () => {
		await signOut({
			fetchOptions: {
				onSuccess: () => {
					router.push("/signin");
				},
			},
		});
	};

	const handleResendVerification = async (email: string) => {
		refetch();
		const isVerified = session?.user?.emailVerified;
		if (isVerified) {
			toast.error("Email already verified");
			router.push("/dashboard");
		}
		await sendVerificationEmail({
			email,
		});
	};

	const sendOTP = async (phoneNumber: string) => {
		refetch();
		if (!session) {
			router.push("/sign-in");
		} else {
			await sendOtp({
				phoneNumber,
			});
		}
	};

	const handleVerifyOTP = async (phoneNumber: string, code: string) => {
		refetch();
		if (!session) {
			router.push("/sign-in");
		} else {
			const isVerified = await verify({
				phoneNumber,
				code,
				updatePhoneNumber: true,
			});
			return isVerified;
		}
	};

	const addNames = async (firstName: string, lastName: string) => {
		refetch();
		if (!session?.user?.id) {
			router.push("/sign-in");
			return;
		}

		const result = await updateUser({
			name: firstName,
			lastName: lastName,
		});

		return result;
	};

	return {
		handleOauthSignin,
		handleEmailSignIn,
		handleEmailSignUp,
		handleSignOut,
		handleResendVerification,
		sendOTP,
		handleVerifyOTP,
		isLoading,
		addNames,
		isSelectedProvider,
		error,
	};
};
