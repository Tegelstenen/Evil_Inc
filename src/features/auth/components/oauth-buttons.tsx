import { Button } from "@/components/ui/button";

import { oAuthProviderIconMap, OAuthProviders } from "../types";
type OAuthButtonsProps = {
	provider: string;
	isLoading: boolean;
	handleOauthSignin: (provider: OAuthProviders) => void;
	isSelectedProvider: (provider: OAuthProviders) => boolean;
	isSignUp?: boolean;
};

const OAuthButtons = (props: OAuthButtonsProps) => {
	return (
		<div className="flex w-full justify-center" key={props.provider}>
			<Button
				disabled={props.isLoading}
				onClick={() =>
					props.handleOauthSignin(props.provider as OAuthProviders)
				}
				className={`glow-on-hover flex w-[320px] items-center justify-center gap-2 px-4 py-3 transition-colors ${
					props.isSelectedProvider(props.provider as OAuthProviders)
						? "glow-active"
						: ""
				}`}
			>
				<div className="flex items-center gap-2">
					<svg
						aria-hidden="true"
						viewBox="0 0 24 24"
						className="h-5 w-5 flex-shrink-0"
						fill="currentColor"
						dangerouslySetInnerHTML={{
							__html:
								oAuthProviderIconMap[
									props.provider as keyof typeof oAuthProviderIconMap
								].svg,
						}}
					/>
					<span>
						{props.isSignUp ? "Sign up with" : "Sign in with"}{" "}
						{props.provider.charAt(0).toUpperCase() + props.provider.slice(1)}
					</span>
				</div>
			</Button>
		</div>
	);
};

export default OAuthButtons;
