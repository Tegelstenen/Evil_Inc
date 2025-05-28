import Link from "next/link";

const Terms = () => {
	return (
		<p className="pt-10 text-xs text-white/40">
			By signing up, you agree to the{" "}
			<Link
				href="#"
				className="text-white/40 underline transition-colors hover:text-white/60"
			>
				MSA
			</Link>
			,{" "}
			<Link
				href="#"
				className="text-white/40 underline transition-colors hover:text-white/60"
			>
				Product Terms
			</Link>
			,{" "}
			<Link
				href="#"
				className="text-white/40 underline transition-colors hover:text-white/60"
			>
				Policies
			</Link>
			,{" "}
			<Link
				href="#"
				className="text-white/40 underline transition-colors hover:text-white/60"
			>
				Privacy Notice
			</Link>
			, and{" "}
			<Link
				href="#"
				className="text-white/40 underline transition-colors hover:text-white/60"
			>
				Cookie Notice
			</Link>
			.
		</p>
	);
};

export default Terms;
