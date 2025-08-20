"use client";
import { UnifrakturMaguntia } from "next/font/google";
import Image from "next/image";
import { useRouter } from "next/navigation";

import DustCloud from "@/components/hero/Cloud";
import { Button } from "@/components/ui/button";

const unifrakturMaguntia = UnifrakturMaguntia({
	weight: "400",
	subsets: ["latin"],
});

const width = 650;

const HomePage = () => {
	const router = useRouter();
	return (
		<div className="relative flex min-h-screen w-full items-center justify-center">
			{/* Left side navigation buttons - absolutely positioned */}
			<div className="absolute top-1/2 left-8 z-10 flex -translate-y-1/2 flex-col space-y-4">
				<Button
					variant="link"
					className="text-1xl justify-start"
					onClick={() => router.push("/originals")}
				>
					Originals
				</Button>
				<Button
					variant="link"
					className="text-1xl justify-start"
					onClick={() => router.push("/prints")}
				>
					Prints
				</Button>
				<Button
					variant="link"
					className="text-1xl justify-start"
					onClick={() => router.push("/merch")}
				>
					Merch
				</Button>
				<Button
					variant="link"
					className="text-1xl justify-start"
					onClick={() => router.push("/about")}
				>
					About
				</Button>
			</div>

			{/* Main centered content - perfectly centered */}
			<div className="flex flex-col items-center justify-center">
				<h1
					className={`mb-4 text-4xl font-bold ${unifrakturMaguntia.className}`}
				>
					Evil
				</h1>
				<div
					className="relative mb-4 flex items-center justify-center overflow-hidden rounded-lg shadow-lg"
					style={{ width: `${width}px`, height: `${width}px` }}
				>
					<DustCloud />
					<div className="absolute inset-0 z-10 flex items-center justify-center">
						<Image
							src="/icon.png"
							alt="Evil Inc Logo"
							width={width}
							height={width}
							className="object-contain"
							priority
						/>
					</div>
				</div>
				<h1 className={`text-4xl font-bold ${unifrakturMaguntia.className}`}>
					Incorporated
				</h1>
			</div>
		</div>
	);
};

export default HomePage;
