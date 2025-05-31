import { createAuthClient } from "better-auth/client";
import { magicLinkClient } from "better-auth/client/plugins";

export const { useSession, getSession, signIn, signOut, signUp } =
	createAuthClient({
		baseURL: process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000",
		plugins: [magicLinkClient()],
	});
