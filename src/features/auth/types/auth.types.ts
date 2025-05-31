import z from "zod";

import type { auth } from "@/lib/auth";
import type { signIn } from "@/lib/auth-client";

import {
	CompleteProfileSchema,
	OTPFormSchema,
	SignInSchema,
	SignUpSchema,
} from "./auth.zodschemas";

export type User = (typeof auth.$Infer.Session)["user"];
export type Session = (typeof auth.$Infer.Session)["session"];
export type OAuthProviders = Parameters<typeof signIn.social>[0]["provider"];

export type SignInData = z.infer<typeof SignInSchema>;
export type SignUpData = z.infer<typeof SignUpSchema>;

export type CompleteProfileData = z.infer<typeof CompleteProfileSchema>;

export type OTPFormData = z.infer<typeof OTPFormSchema>;
