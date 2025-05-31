"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
	CompleteProfileData,
	ContactInfoForm,
	OTPForm,
	useAuth,
} from "@/features/auth";
import { useSession } from "@/lib/auth-client";

const CompleteProfilePage = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [showOTP, setShowOTP] = useState(false);
	const [correctOtp, setCorrectOtp] = useState<boolean | null>(null);
	const [contactInfo, setContactInfo] = useState<{
		firstName: string;
		lastName: string;
		phoneNumber: string;
	} | null>(null);
	const { handleVerifyOTP, sendOTP, addNames } = useAuth();
	const router = useRouter();
	const { data: session, isPending } = useSession();

	useEffect(() => {
		if (!session && !isPending) {
			router.push("/signin");
		}
	}, [session, isPending, router]);

	const onFormSubmit = async (data: CompleteProfileData) => {
		setIsLoading(true);
		setContactInfo({
			firstName: data.firstName,
			lastName: data.lastName,
			phoneNumber: data.phoneNumber,
		});
		sendOTP(data.phoneNumber);
		setShowOTP(true);
		setIsLoading(false);
	};

	const handleOTPSubmit = async (otp: string) => {
		setIsLoading(true);
		if (!contactInfo) {
			setShowOTP(false);
			return;
		}
		const result = await handleVerifyOTP(
			contactInfo.phoneNumber,
			otp.toString(),
		);
		console.log("result", result);
		if (result?.data?.status === true) {
			setCorrectOtp(true);
			await addNames(contactInfo.firstName, contactInfo.lastName);
			router.push("/dashboard");
		} else if (result?.error?.code === "INVALID_OTP") {
			setCorrectOtp(false);
		} else if (result?.error?.code === "OTP_NOT_FOUND") {
			setCorrectOtp(null);
			setShowOTP(false);
		}
		setIsLoading(false);
	};

	const handleResendOTP = () => {
		if (!contactInfo) {
			router.push("/sign-in");
		} else {
			sendOTP(contactInfo.phoneNumber);
		}
	};

	return (
		<div className="flex min-h-full items-center justify-center">
			{showOTP ? (
				<OTPForm
					onOTPSubmit={handleOTPSubmit}
					isLoading={isLoading}
					correctOtp={correctOtp}
					onResendOTP={handleResendOTP}
					setCorrectOtp={setCorrectOtp}
				/>
			) : (
				<ContactInfoForm onSubmit={onFormSubmit} isLoading={isLoading} />
			)}
		</div>
	);
};

export default CompleteProfilePage;
