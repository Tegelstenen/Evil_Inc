import { useRouter } from "next/navigation";
import { useState } from "react";

import { signIn, signUp } from "@/lib/auth-client";

import { OAuthProviders, SignInData, SignUpData } from "../types";

export const useAuth = () => {
	const [loadingAction, setLoadingAction] = useState<
		OAuthProviders | "email" | null
	>(null);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

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
					onError: (ctx) => {
						setError(ctx.error.message);
						setLoadingAction(null);
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
					onSuccess: () => {
						router.push("/dashboard");
					},
				},
			);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to sign up");
			setLoadingAction(null);
		}
	};

	return {
		handleOauthSignin,
		handleEmailSignIn,
		handleEmailSignUp,
		isLoading,
		isSelectedProvider,
		error,
	};
};
