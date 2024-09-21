import nodemailer from "nodemailer";
import { sendError, messages } from "./mensagens.js";

export default async function enviaemail(infoemail) {
    // criar um transportador para enviar o email
    try {
            let transporter = nodemailer.createTransport({
                host: process.env.HOST_SERVER_EMAIL,
                port: process.env.PORT_SSL_EMAIL,
                secure: false,
                auth: {
                    user: process.env.API_SEND_EMAIL,
                    pass: process.env.PASS_SEND_EMAIL,
                },
            });
            await transporter.sendMail(infoemail)

    }
    catch (err) {
        return sendError(res,500,err.message)
    }
}