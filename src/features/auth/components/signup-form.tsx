"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { OAuthProviders, SignUpData, SignUpSchema } from "../types";

type SignUpFormProps = {
	handleEmailSignUp: (data: SignUpData) => void;
	isLoading: boolean;
	isSelectedProvider: (provider: OAuthProviders) => boolean;
};

const SignUpForm = (props: SignUpFormProps) => {
	const form = useForm<SignUpData>({
		resolver: zodResolver(SignUpSchema),
		defaultValues: {
			email: "",
			password: "",
			confirmPassword: "",
		},
	});
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(props.handleEmailSignUp)}
				className="space-y-4"
			>
				<div className="flex w-full justify-center">
					<div className="w-[320px]">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											placeholder="Email"
											{...field}
											className="w-full text-white"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</div>
				<div className="flex w-full justify-center">
					<div className="w-[320px]">
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											placeholder="Password"
											type="password"
											{...field}
											className="w-full text-white"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</div>
				<div className="flex w-full justify-center">
					<div className="w-[320px]">
						<FormField
							control={form.control}
							name="confirmPassword"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											placeholder="Repeat Password"
											type="password"
											{...field}
											className="w-full text-white"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</div>
				<div className="flex w-full justify-center">
					<Button
						type="submit"
						disabled={props.isLoading}
						className={`glow-on-hover flex w-[320px] items-center justify-center gap-2 px-4 py-3 transition-colors ${
							props.isSelectedProvider("email" as OAuthProviders)
								? "glow-active"
								: ""
						}`}
					>
						Sign Up
					</Button>
				</div>
			</form>
		</Form>
	);
};

export default SignUpForm;
