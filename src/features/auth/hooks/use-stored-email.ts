import { useEffect, useState } from "react";

const STORAGE_KEY = "userEmail";

export const useStoredEmail = () => {
	const [email, setEmail] = useState<string | null>(null);
	const [isPending, setIsPending] = useState(true); // Start as pending

	// Load from localStorage on mount (client-side only)
	useEffect(() => {
		const stored = localStorage.getItem(STORAGE_KEY);
		setEmail(stored);
		setIsPending(false);
	}, []);

	// Save to localStorage when email is set
	const saveEmail = async (email: string) => {
		setIsPending(true);
		try {
			localStorage.setItem(STORAGE_KEY, email);
			setEmail(email);
		} finally {
			setIsPending(false);
		}
	};

	// Clear from localStorage and state
	const clearEmail = async () => {
		setIsPending(true);
		try {
			localStorage.removeItem(STORAGE_KEY);
			setEmail(null);
		} finally {
			setIsPending(false);
		}
	};

	return { email, saveEmail, clearEmail, isPending };
};
