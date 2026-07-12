import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.RESEND_API) {
    console.warn("Provide RESEND_API from dotenv file");
}

const resend = new Resend(process.env.RESEND_API || '');

interface SendEmailParams {
    sendTo: string;
    subject: string;
    html: string;
}

const sendEmail = async ({ sendTo, subject, html }: SendEmailParams): Promise<any> => {
    try {
        const { data, error } = await resend.emails.send({
            // Updated sender metadata to align with a central disaster/incident response hub
            from: 'Incident Command Center <support@kielhelmet.shop>', 
            to: sendTo,
            subject: subject,
            html: html,
        });

        if (error) {
            console.error({ error });
            return null;
        }
        return data;

    } catch (error) {
        console.error("Failed to execute email dispatch infrastructure:", error);
        return null;
    }
}

export default sendEmail;