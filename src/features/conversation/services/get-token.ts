"use server";

const getToken = async () => {
	try {
		const response = await fetch(
			"https://api.openai.com/v1/realtime/sessions",
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					model: "gpt-4o-realtime-preview-2024-12-17",
					voice: "verse",
				}),
			},
		);

		const data = await response.json();

		if (!response.ok) {
			console.error("OpenAI API error:", data);
			throw new Error(
				data.error?.message ?? `HTTP error! status: ${response.status}`,
			);
		}

		return data;
	} catch (error) {
		console.error("Token generation error:", error);
		throw new Error(
			error instanceof Error ? error.message : "Failed to generate token",
		);
	}
};

export default getToken;
