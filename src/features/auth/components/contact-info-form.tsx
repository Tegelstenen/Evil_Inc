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
import { PhoneInput } from "@/components/ui/phone-input";

import { CompleteProfileData, CompleteProfileSchema } from "../types";

type ContactInfoFormProps = {
	onSubmit: (data: CompleteProfileData) => void;
	isLoading: boolean;
};

const ContactInfoForm = (props: ContactInfoFormProps) => {
	const form = useForm<CompleteProfileData>({
		resolver: zodResolver(CompleteProfileSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			phoneNumber: "",
		},
	});
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(props.onSubmit)} className="space-y-4">
				<div className="flex w-full justify-center">
					<div className="w-[320px]">
						<FormField
							control={form.control}
							name="firstName"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											placeholder="First Name"
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
							name="lastName"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											placeholder="Last Name"
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
							name="phoneNumber"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<PhoneInput
											placeholder="Phone Number"
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
							props.isLoading ? "glow-active" : ""
						}`}
					>
						Continue
					</Button>
				</div>
			</form>
		</Form>
	);
};

export default ContactInfoForm;
