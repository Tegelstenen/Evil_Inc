import z from "zod";

import type { auth } from "@/lib/auth";
import type { signIn } from "@/lib/auth-client";

export type User = (typeof auth.$Infer.Session)["user"];
export type Session = (typeof auth.$Infer.Session)["session"];
export type OAuthProviders = Parameters<typeof signIn.social>[0]["provider"];

export const emailSchema = z
	.string()
	.min(1, "Email is required")
	.email("Invalid email format");

export const passwordSchema = z
	.string()
	.min(8, { message: "Password must be at least 8 characters long" })
	.refine((password) => /[A-Z]/.test(password), {
		message: "Password must contain at least one uppercase letter",
	})
	.refine((password) => /[a-z]/.test(password), {
		message: "Password must contain at least one lowercase letter",
	})
	.refine((password) => /\d/.test(password), {
		message: "Password must contain at least one number",
	})
	.refine((password) => /[!@#$%^&*.-]/.test(password), {
		message: "Password must contain at least one special character",
	});

export const SignInSchema = z.object({
	email: emailSchema,
	password: passwordSchema,
});

export type SignInData = z.infer<typeof SignInSchema>;

const confirmPasswordSchema = z.string().min(1, "Please confirm your password");

export const SignUpSchema = z
	.object({
		email: emailSchema,
		password: passwordSchema,
		confirmPassword: confirmPasswordSchema,
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

export type SignUpData = z.infer<typeof SignUpSchema>;
