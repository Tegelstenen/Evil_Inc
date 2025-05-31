import { isValidPhoneNumber } from "libphonenumber-js";
import { z } from "zod";

export const OTPFormSchema = z.object({
	otp: z.string().length(6, "OTP must be 6 characters"),
});

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

export const confirmPasswordSchema = z
	.string()
	.min(1, "Please confirm your password");

export const SignInSchema = z.object({
	email: emailSchema,
	password: passwordSchema,
});

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

export const unicodeNameSchema = z
	.string()
	.min(1, "Name cannot be empty")
	.max(50, "Name is too long")
	.regex(/^[\p{L}\p{M}' -]+$/u, "Name contains invalid characters");

export const phoneNumberSchema = z
	.string()
	.min(1, "Phone number is required")
	.refine(
		(value) => {
			try {
				if (!isValidPhoneNumber(value)) return false;

				// Parse the phone number to get additional information
				// const phoneNumber = parsePhoneNumber(value);

				// Additional validation if needed
				// For example, you could restrict to specific countries:
				// return phoneNumber.country === "SE"; // Only allow Swedish numbers

				return true;
			} catch {
				return false;
			}
		},
		{
			message:
				"Please enter a valid international phone number (e.g., +46701234567)",
		},
	);

export const CompleteProfileSchema = z.object({
	firstName: unicodeNameSchema,
	lastName: unicodeNameSchema,
	phoneNumber: phoneNumberSchema,
});
