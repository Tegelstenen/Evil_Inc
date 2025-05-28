import { phoneNumberClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	apiUrl: "/api/auth",
	plugins: [phoneNumberClient()],
});

export const sendOTP = async (
	phoneNumber: string,
	firstName: string,
	lastName: string,
) => {
	return authClient.phoneNumber.sendOtp({
		phoneNumber,
		fetchOptions: {
			headers: {
				"x-first-name": firstName,
				"x-last-name": lastName,
			},
		},
	});
};

export const verifyOTP = async (
	phoneNumber: string,
	code: string,
	firstName: string,
	lastName: string,
) => {
	return authClient.phoneNumber.verify({
		phoneNumber,
		code,
		fetchOptions: {
			headers: {
				"x-first-name": firstName,
				"x-last-name": lastName,
			},
		},
	});
};

export const getSession = async () => {
	return authClient.getSession();
};
