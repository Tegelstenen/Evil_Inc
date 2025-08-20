"use client";

import { ShoppingBasket } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "../ui/button";

const Navbar = () => {
	const router = useRouter();

	return (
		<div className="bg-primary text-primary-foreground relative flex h-[60px] flex-row items-center justify-between rounded-b-lg p-4">
			{/* Left content, nav links*/}
			<div className="flex flex-1 items-center justify-start">
				<Button
					variant="link"
					className="text-primary-foreground"
					onClick={() => router.push("/originals")}
				>
					Originals
				</Button>
				<Button
					variant="link"
					className="text-primary-foreground"
					onClick={() => router.push("/prints")}
				>
					Prints
				</Button>
				<Button
					variant="link"
					className="text-primary-foreground"
					onClick={() => router.push("/merch")}
				>
					Merch
				</Button>
				<Button
					variant="link"
					className="text-primary-foreground"
					onClick={() => router.push("/about")}
				>
					About
				</Button>
			</div>

			<Button
				className="bg-primary absolute top-1 left-1/2 h-28 w-28 -translate-x-1/2 rounded-lg"
				onClick={() => router.push("/")}
			>
				<Image
					src="/icon.png"
					alt="logo"
					fill
					className="object-contain p-0" /* adjust padding here */
				/>
			</Button>

			{/* Right content, icon links*/}
			<div className="flex h-12 w-12 flex-1 items-center justify-end">
				<Button variant="ghost" size="icon">
					<ShoppingBasket className="!h-6 !w-6" />
				</Button>
			</div>
		</div>
	);
};

export default Navbar;
