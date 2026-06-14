import nodemailer from "nodemailer";

class EmailService {
  constructor() {
    this.transporter = null;
    this.init();
  }

  async init() {
    try {
      // Create a test account using Ethereal email for testing
      const testAccount = await nodemailer.createTestAccount();

      this.transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: testAccount.user, // generated ethereal user
          pass: testAccount.pass, // generated ethereal password
        },
      });

      console.log(`[Email Service] Initialized with ethereal user: ${testAccount.user}`);
    } catch (error) {
      console.warn(`[Email Service] Ethereal email initialization failed (${error.message}). Using fallback mock transport.`);
      // Fallback transport that doesn't actually send emails, just streams them
      this.transporter = nodemailer.createTransport({
        streamTransport: true,
        newline: 'windows'
      });
    }
  }

  async sendOTP(email, otp) {
    if (!this.transporter) {
      console.warn("[Email Service] Transporter not ready yet, unable to send OTP.");
      return;
    }

    try {
      const info = await this.transporter.sendMail({
        from: '"SkillBridge" <noreply@skillbridge.edu>', // sender address
        to: email, // list of receivers
        subject: "Your SkillBridge Verification Code", // Subject line
        text: `Your OTP for SkillBridge registration is: ${otp}. It is valid for 10 minutes.`, // plain text body
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
            <h2>SkillBridge Registration</h2>
            <p>Your one-time password (OTP) is:</p>
            <h1 style="color: #0052ff; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
            <p>This code is valid for 10 minutes.</p>
          </div>
        `, // html body
      });

      console.log("[Email Service] Message sent: %s", info.messageId || "mock-id");
      
      // Preview only available when sending through an Ethereal account
      let previewUrl = null;
      if (info.messageId && !this.transporter.options.streamTransport) {
        previewUrl = nodemailer.getTestMessageUrl(info);
        if (previewUrl) {
          console.log("[Email Service] Preview URL: %s", previewUrl);
        }
      } else {
        console.log(`[Email Service] Simulated email to ${email}. OTP: ${otp}`);
      }
      
      return previewUrl;
    } catch (error) {
      console.error("[Email Service] Failed to send email", error);
      throw error;
    }
  }
}

export const emailService = new EmailService();
