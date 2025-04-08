import nodemailer from "nodemailer";

export async function sendVerification(email: string, username: string, verifyCode: string) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App password
      },
    });

    const mailOptions = {
      from: `"MystryMsg" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "MystryMsg | Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
          <h2 style="color: #333; text-align: center;">Hello ${username},</h2>
          <p style="color: #555; font-size: 16px;">
            Thank you for registering with <strong>MystryMsg</strong>. Please use the following verification code:
          </p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: bold; color: #007BFF; padding: 10px 20px; border: 2px dashed #007BFF; border-radius: 5px;">
              ${verifyCode}
            </span>
          </div>
          <p style="color: #777; font-size: 14px;">If you did not request this, ignore this email.</p>
          <hr style="margin: 20px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            &copy; ${new Date().getFullYear()} MystryMsg. All rights reserved.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("❌ Email send failed:", error);
    return { success: false, message: "Failed to send verification email" };
  }
}
