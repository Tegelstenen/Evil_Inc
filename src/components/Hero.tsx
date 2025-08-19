import DustCloud from "@/features/hero/components/dustcloud";

const Hero = () => {
	return (
		<section className="relative flex min-h-screen items-center justify-center overflow-hidden">
			{/* Background Pattern */}
			<div className="absolute inset-0">
				<DustCloud isActive={true} isTalking={false} talkingIntensity={0} />
			</div>

			{/* Navigation Sidebar */}

			<div className="relative z-10 container mx-auto px-6 text-center">
				<div className="mx-auto max-w-4xl">
					<h1 className="text-foreground mb-6 text-6xl font-bold md:text-8xl">
						<span className="block text-white">EVIL</span>
						<span className="text-red block tracking-wider">INCORPORATED</span>
					</h1>
				</div>
			</div>
		</section>
	);
};

export default Hero;
