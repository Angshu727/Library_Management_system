import { sendEmail } from "./sendEmail.js";
import { generateVerificationEmailTemplate } from "../utils/emailTemplate.js";

export async function sendVerificationCode(verificationCode, email, res){
    try {
        const message = generateVerificationEmailTemplate(verificationCode);
        sendEmail({
            email,
            subject: "Verification Code - Library Management System",
            message,
        });
        res.status(200).json({
            success:true,
            message:`Verification code sent to ${email} successfully`,
        });
    } catch (error) {
        console.error("Email error:", error);
        return res.status(500).json({
            success:false,
            message:"Failed to send verification email",
        });
    }
}