import nodemailer from "nodemailer";
import { IEmailService } from "../../application/services/IEmailService";

export class NodeMailerService implements IEmailService {
    private transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        }
    })

    async sendEmail(to: string, subject: string, body: string): Promise<void> {
        await this.transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text: body,
        })
    }
}