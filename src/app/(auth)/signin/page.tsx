"use client";

import Link from "next/link";

import {
	OAuthButtons,
	oAuthProviderIconMap,
	SignInForm,
	useAuth,
} from "@/features/auth";

const SignInPage = () => {
	const {
		handleOauthSignin,
		handleEmailSignIn,
		isLoading,
		isSelectedProvider,
		error,
	} = useAuth();

	return (
		<div className="space-y-6 text-center">
			{error && <div className="text-sm text-red-400">{error}</div>}

			<div className="space-y-4">
				{Object.entries(oAuthProviderIconMap).map(([provider]) => (
					<OAuthButtons
						key={provider}
						provider={provider}
						isLoading={isLoading}
						handleOauthSignin={handleOauthSignin}
						isSelectedProvider={isSelectedProvider}
					/>
				))}

				<div className="flex items-center gap-4">
					<div className="h-px flex-1 bg-white/10" />
					<span className="text-sm text-white/40">or</span>
					<div className="h-px flex-1 bg-white/10" />
				</div>

				<SignInForm
					handleEmailSignIn={handleEmailSignIn}
					isLoading={isLoading}
					isSelectedProvider={isSelectedProvider}
				/>

				<div className="mt-4 text-center text-sm text-white/60">
					Don&apos;t have an account?{" "}
					<Link href="/signup" className="text-white hover:underline">
						Sign Up
					</Link>
				</div>
			</div>
		</div>
	);
};

export default SignInPage;
