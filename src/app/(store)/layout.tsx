import Navbar from "@/components/navbar/Navbar";

const StoreLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div>
			<Navbar />
			{children}
		</div>
	);
};

export default StoreLayout;
