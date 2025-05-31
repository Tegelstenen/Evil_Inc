import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { VerificationEmail } from "@/features/auth/components";
import { db } from "@/lib/server/db/db";
import * as schema from "@/lib/server/db/schemas/auth-schema";

import { sendEmail } from "./email";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: schema,
	}),
	rateLimit: {
		enabled: true,
		window: 60,
		max: 100,
		customRules: {
			"/verify-email": {
				window: 60,
				max: 1,
			},
		},
		storage: "database",
	},
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
	},
	emailVerification: {
		sendVerificationEmail: async ({ user, url }) => {
			url = url + "verify-email";
			await sendEmail({
				from: "HER <onboarding@resend.dev>",
				receivers: [user.email],
				subject: "Verify your email address",
				content: VerificationEmail({ url }),
			});
		},
		autoSignInAfterVerification: true,
	},
	account: {
		accountLinking: {
			enabled: true,
		},
	},
	socialProviders: {
		github: {
			clientId: process.env.GITHUB_CLIENT_ID as string,
			clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
		},
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		},
		facebook: {
			clientId: process.env.FACEBOOK_CLIENT_ID as string,
			clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
		},
	},
});
