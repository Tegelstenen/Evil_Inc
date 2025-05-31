import BoxSpinner from "./suspense-animations";

type LoadingScreenProps = {
	message: string;
};

const LoadingScreen = (props: LoadingScreenProps) => {
	return (
		<div className="flex h-full w-full items-center justify-center">
			<div className="flex flex-col items-center">
				<BoxSpinner />
				<h1 className="text-md mt-10 text-white">{props.message}</h1>
			</div>
		</div>
	);
};

export default LoadingScreen;
