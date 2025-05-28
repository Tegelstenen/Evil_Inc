import { SimpleIcon } from "simple-icons";

interface OAuthButtonProps {
	providers: string;
	icon: SimpleIcon;
	handleOauthSubmit: (provider: string) => void;
}

const OAuthButton = (props: OAuthButtonProps) => {
	return (
		<div className="flex w-full justify-center">
			<button
				onClick={() => props.handleOauthSubmit(props.providers.toLowerCase())}
				className="glow-on-hover flex w-[320px] items-center justify-center gap-2 px-4 py-3 transition-colors"
			>
				<div className="flex items-center gap-2">
					<svg
						aria-hidden="true"
						viewBox="0 0 24 24"
						className="h-5 w-5 flex-shrink-0"
						fill="currentColor"
						dangerouslySetInnerHTML={{ __html: props.icon.svg }}
					/>
					<span>Sign in with {props.providers}</span>
				</div>
			</button>
		</div>
	);
};

export default OAuthButton;
