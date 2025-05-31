"use client";

import Link from "next/link";

import {
	OAuthButtons,
	oAuthProviderIconMap,
	SignUpForm,
	TermsAndConditions,
	useAuth,
} from "@/features/auth";

const SignUpPage = () => {
	const {
		handleOauthSignin,
		handleEmailSignUp,
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
						isSignUp={true}
					/>
				))}

				<div className="flex items-center gap-4">
					<div className="h-px flex-1 bg-white/10" />
					<span className="text-sm text-white/40">or</span>
					<div className="h-px flex-1 bg-white/10" />
				</div>

				<SignUpForm
					handleEmailSignUp={handleEmailSignUp}
					isLoading={isLoading}
					isSelectedProvider={isSelectedProvider}
				/>

				<div className="mt-4 text-center text-sm text-white/60">
					Already have an account?{" "}
					<Link href="/signin" className="text-white hover:underline">
						Sign In
					</Link>
				</div>
			</div>
			<TermsAndConditions />
		</div>
	);
};

export default SignUpPage;
