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

import { OAuthProviders, SignInData, SignInSchema } from "../types";

type SignInFormProps = {
	handleEmailSignIn: (data: SignInData) => void;
	isLoading: boolean;
	isSelectedProvider: (provider: OAuthProviders) => boolean;
};

const SignInForm = (props: SignInFormProps) => {
	const form = useForm<SignInData>({
		resolver: zodResolver(SignInSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(props.handleEmailSignIn)}
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
					<Button
						type="submit"
						disabled={props.isLoading}
						className={`glow-on-hover flex w-[320px] items-center justify-center gap-2 px-4 py-3 transition-colors ${
							props.isSelectedProvider("email" as OAuthProviders)
								? "glow-active"
								: ""
						}`}
					>
						Sign In
					</Button>
				</div>
			</form>
		</Form>
	);
};

export default SignInForm;
