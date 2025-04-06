import nodemailer from "nodemailer";

export async function sendVerification(email: string, username: string, verifyCode: string) {
    try {
        // Create a transporter using Gmail SMTP
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER, // Your Gmail address
                pass: process.env.EMAIL_PASS, // 16-digit App Password
            },
        });

        // Email content
        const mailOptions = {
            from: `"MystryMsg" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "MystryMsg | Verification Code",
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
                <h2 style="color: #333; text-align: center;">Hello ${username},</h2>
                <p style="color: #555; font-size: 16px;">
                    Thank you for registering with <strong>MystryMsg</strong>. Please use the following verification code to complete your registration:
                </p>
                <div style="text-align: center; margin: 20px 0;">
                    <span style="display: inline-block; font-size: 24px; font-weight: bold; color: #007BFF; padding: 10px 20px; border: 2px dashed #007BFF; border-radius: 5px;">
                        ${verifyCode}
                    </span>
                </div>
                <p style="color: #777; font-size: 14px;">
                    If you did not request this code, please ignore this email.
                </p>
                <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                <p style="color: #999; font-size: 12px; text-align: center;">
                    &copy; ${new Date().getFullYear()} MystryMsg. All rights reserved.
                </p>
            </div>
        `,
        
        }
        // Send email
        await transporter.sendMail(mailOptions);

        return { success: true, message: "Verification email sent successfully" };
    } catch (error) {
        console.error("Email error:", error);
        return { success: false, message: "Failed to send verification email" };
    }
}
