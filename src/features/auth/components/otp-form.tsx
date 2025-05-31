"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";

import { OTPFormData, OTPFormSchema } from "../types";

type OTPFormProps = {
	onOTPSubmit: (otp: string) => void;
	onResendOTP: () => void;
	setCorrectOtp: (correctOtp: boolean | null) => void;
	isLoading: boolean;
	correctOtp: boolean | null;
};

const OTPForm = (props: OTPFormProps) => {
	const [resendTimer, setResendTimer] = useState(0);

	useEffect(() => {
		if (resendTimer > 0) {
			const timer = setInterval(() => {
				setResendTimer((prev) => prev - 1);
			}, 1000);
			return () => clearInterval(timer);
		}
	}, [resendTimer]);

	const handleResend = () => {
		props.onResendOTP();
		setResendTimer(30);
	};

	const form = useForm<OTPFormData>({
		resolver: zodResolver(OTPFormSchema),
		defaultValues: {
			otp: "",
		},
	});

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit((data) =>
					props.onOTPSubmit(data.otp.toString()),
				)}
				className="space-y-6"
			>
				<div className="flex w-full justify-center">
					<div className="w-[320px]">
						<FormField
							control={form.control}
							name="otp"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-white">
										One-Time Password
									</FormLabel>
									<FormControl>
										<InputOTP
											maxLength={6}
											value={field.value}
											onChange={(val) => {
												field.onChange(val);
												if (val.length < 6) {
													props.setCorrectOtp(null);
												}
											}}
											containerClassName="gap-0 w-full"
										>
											<InputOTPGroup className="flex w-full">
												{Array.from({ length: 6 }).map((_, index) => (
													<InputOTPSlot
														key={index}
														index={index}
														aria-invalid={props.correctOtp === false}
														className={` ${index === 0 ? "rounded-l-md" : ""} ${index === 5 ? "rounded-r-md" : ""} ${index !== 0 ? "border-l-0" : ""} min-w-0 flex-1 bg-inherit`}
													/>
												))}
											</InputOTPGroup>
										</InputOTP>
									</FormControl>
									<FormDescription className="text-white">
										Please enter the one-time password sent to your phone.
									</FormDescription>
									<div className="text-muted-foreground text-sm">
										Didn&apos;t receive the code?{" "}
										<button
											type="button"
											onClick={handleResend}
											disabled={resendTimer > 0}
											className={`hover:text-primary cursor-pointer underline ${
												resendTimer > 0 ? "cursor-not-allowed opacity-50" : ""
											}`}
										>
											{resendTimer > 0
												? `Send again (${resendTimer}s)`
												: "Send again"}
										</button>
									</div>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</div>

				<Button
					type="submit"
					disabled={props.isLoading}
					className={`glow-on-hover flex w-full items-center justify-center gap-2 px-4 py-3 transition-colors ${
						props.isLoading ? "glow-active" : ""
					}`}
				>
					Verify
				</Button>
			</form>
		</Form>
	);
};

export default OTPForm;
