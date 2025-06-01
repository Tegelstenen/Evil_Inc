import { DustCloud } from ".";

const getStateText = (isActive: boolean, isTalking: boolean): string => {
	if (!isActive) return "Inactive";
	return isTalking ? "Talking" : "Listening";
};
type OrbProps = {
	isActive: boolean;
	isTalking: boolean;
	talkingIntensity: number;
};

const Orb = (props: OrbProps) => {
	return (
		<div className="flex min-h-full w-full flex-col items-center justify-center gap-4 p-4">
			<div className="relative h-64 w-64 overflow-hidden rounded-full">
				<div className="absolute inset-0 rounded-full border border-white/20 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm" />
				<DustCloud
					isActive={props.isActive}
					isTalking={props.isTalking}
					talkingIntensity={props.talkingIntensity}
				/>
			</div>
			<div className="text-lg font-medium text-white/80">
				{getStateText(props.isActive, props.isTalking)}
			</div>
		</div>
	);
};

export { Orb };
