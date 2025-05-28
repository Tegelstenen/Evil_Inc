import { z } from "zod";

// Form validation schema
export const AuthFormSchema = z.object({
	firstName: z
		.string()
		.min(2, { message: "First name must be at least 2 characters" })
		.refine((val) => !/\d/.test(val), {
			message: "First name should not contain numbers",
		}),
	lastName: z
		.string()
		.min(2, { message: "Last name must be at least 2 characters" })
		.refine((val) => !/\d/.test(val), {
			message: "Last name should not contain numbers",
		}),
	phone: z.string().refine((val) => /^\+[1-9]\d{1,14}$/.test(val), {
		message: "Invalid phone number",
	}),
	terms: z.boolean().refine((val) => val === true, {
		message: "You must accept the terms and conditions",
	}),
});

export type AuthFormData = z.infer<typeof AuthFormSchema>;

export interface InputOTPFormProps {
	phoneNumber: string;
	firstName: string;
	lastName: string;
	onVerificationSuccess: () => void;
	onBackToRegistration: () => void;
}
