"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useAuth, VerificationMessage } from "@/features/auth";
import { useStoredEmail } from "@/features/auth/hooks/use-stored-email";
import { LoadingScreen } from "@/features/shared/components";
import { useSession } from "@/lib/auth-client";

const VerifyEmailPage = () => {
	const searchParams = useSearchParams();
	const { email, clearEmail, isPending: isEmailPending } = useStoredEmail();
	const router = useRouter();
	const { data: session, isPending: isSessionPending } = useSession();
	const { handleResendVerification } = useAuth();
	const [isLoading, setIsLoading] = useState(false);

	const error = searchParams.get("error");

	const successfullVerification = () => {
		if (session?.user.emailVerified) {
			clearEmail();
			router.push("/dashboard");
		}
	};
	useEffect(successfullVerification, [
		session?.user.emailVerified,
		clearEmail,
		router,
	]);

	// Combined error and access handling
	const invalidAcessToPage = () => {
		if (isEmailPending) {
			return;
		}

		if (error === "invalid_token") {
			toast.error("Invalid verification link", {
				description:
					"The verification link is invalid or has expired. Please try again.",
			});
			router.push("/signin");
			clearEmail();
		}

		if (error === "token_expired") {
			toast.error("Verification link expired", {
				description: "The verification link has expired. Please try again.",
			});
			router.push("/signin");
			clearEmail();
		}

		// Only redirect if we're sure there's no email and not verified
		if (!error && !isSessionPending && !session && email === null) {
			router.push("/signin");
		}
	};
	useEffect(invalidAcessToPage, [
		error,
		isEmailPending,
		email,
		clearEmail,
		router,
		isSessionPending,
		session,
	]);

	if (email) {
		return (
			<VerificationMessage
				email={email}
				handleResend={() => {
					setIsLoading(true);
					handleResendVerification(email);
					setTimeout(() => {
						setIsLoading(false);
					}, 2000);
				}}
				isLoading={isLoading}
			/>
		);
	}

	return <LoadingScreen message="Loading..." />;
};

export default VerifyEmailPage;
