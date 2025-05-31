interface VerificationEmailProps {
	url: string;
}

const VerificationEmail = (props: VerificationEmailProps) => (
	<div
		style={{
			fontFamily: "Arial, sans-serif",
			maxWidth: "600px",
			margin: "0 auto",
		}}
	>
		<h1 style={{ color: "#333" }}>Verify your email address</h1>
		<p>
			Thanks for signing up! Please verify your email address by clicking the
			button below:
		</p>
		<div style={{ textAlign: "center", margin: "30px 0" }}>
			<a
				href={props.url}
				style={{
					backgroundColor: "#0070f3",
					color: "white",
					padding: "12px 24px",
					borderRadius: "5px",
					textDecoration: "none",
					display: "inline-block",
				}}
			>
				Verify Email Address
			</a>
		</div>
		<p>
			If you didn&apos;t create an account, you can safely ignore this email.
		</p>
		<p>This link will expire in 24 hours.</p>
	</div>
);

export default VerificationEmail;
