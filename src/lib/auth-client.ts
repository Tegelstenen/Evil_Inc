import {
	inferAdditionalFields,
	phoneNumberClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { toast } from "sonner";

import type { auth } from "./auth";

export const {
	useSession,
	getSession,
	signIn,
	signOut,
	signUp,
	sendVerificationEmail,
	updateUser,
	phoneNumber: { sendOtp, verify },
} = createAuthClient({
	baseURL: process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000",
	plugins: [phoneNumberClient(), inferAdditionalFields<typeof auth>()],
	fetchOptions: {
		onError: async (context) => {
			const { response } = context;
			if (response.status === 429) {
				const retryAfter = response.headers.get("X-Retry-After");
				toast.error(
					`Rate limit exceeded. Please try again in ${retryAfter} seconds.`,
				);
			}
		},
	},
});
