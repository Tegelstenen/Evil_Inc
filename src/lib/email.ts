"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({
	from,
	receivers,
	subject,
	content,
}: {
	from: string;
	receivers: string[];
	subject: string;
	content: React.ReactNode;
}) => {
	try {
		const { data, error } = await resend.emails.send({
			from: from,
			to: receivers,
			subject: subject,
			react: content,
		});

		if (error) {
			console.error("Failed to send email:", error);
			throw error;
		}

		return data;
	} catch (error) {
		console.error("Error sending email:", error);
		throw error;
	}
};
