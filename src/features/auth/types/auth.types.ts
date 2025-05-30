import type { auth } from "@/lib/auth";
import type { signIn } from "@/lib/auth-client";

export type User = (typeof auth.$Infer.Session)["user"];
export type Session = typeof auth.$Infer.Session;
export type OAuthProviders = Parameters<typeof signIn.social>[0]["provider"];

export interface AuthState {
	user: User | null;
	session: Session | null;
	isLoading: boolean;
	error: string | null;
}

export const OTP_LENGTH = 6;

export type AuthStep = "selection" | "code" | "loading";
