import { cn } from "@/lib/utils";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div
			className={cn(
				"flex min-h-screen w-full items-center justify-center overflow-hidden",
			)}
		>
			<div className="w-full max-w-sm rounded-2xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-md">
				{children}
			</div>
		</div>
	);
};

export default AuthLayout;
