import nodemailer from "nodemailer";

// Create transporter with better error handling
const createTransporter = () => {
  try {
    const config = {
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    };

    console.log("Email config:", {
      host: config.host,
      port: config.port,
      user: config.auth.user,
      hasPassword: !!config.auth.pass,
    });

    return nodemailer.createTransport(config);
  } catch (error) {
    console.error("Error creating email transporter:", error);
    throw error;
  }
};

// Send email verification OTP
export const sendVerificationOTP = async (email, name, otp) => {
  try {
    // Check if email configuration exists
    if (!process.env.EMAIL_FROM || !process.env.EMAIL_PASSWORD) {
      console.error("Email configuration missing in environment variables");
      return false;
    }

    console.log(`Attempting to send verification OTP to: ${email}`);

    const transporter = createTransporter();

    // Verify transporter configuration
    await transporter.verify();
    console.log("Email transporter verified successfully");

    const mailOptions = {
      from: {
        name: "Pre-Order System",
        address: process.env.EMAIL_FROM,
      },
      to: email,
      subject: "🔐 Email Verification - Pre-Order System",
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #007bff; margin: 0;">📧 Email Verification</h1>
            </div>
            
            <p style="font-size: 16px; color: #333; margin-bottom: 20px;">Hello <strong>${name}</strong>,</p>
            
            <p style="font-size: 14px; color: #666; line-height: 1.6; margin-bottom: 25px;">
              Thank you for registering with our <strong>Pre-Order System</strong>. To complete your registration and secure your account, please verify your email address using the OTP code below:
            </p>
            
            <div style="background: linear-gradient(135deg, #007bff, #0056b3); padding: 25px; text-align: center; margin: 25px 0; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,123,255,0.3);">
              <p style="color: white; margin: 0 0 10px 0; font-size: 14px; font-weight: 500;">Your Verification Code:</p>
              <h1 style="color: white; font-size: 36px; font-weight: bold; margin: 0; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</h1>
            </div>
            
            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; color: #856404; font-size: 13px;">
                ⏰ <strong>Important:</strong> This OTP will expire in <strong>10 minutes</strong> for security reasons.
              </p>
            </div>
            
            <p style="font-size: 13px; color: #666; margin-top: 30px;">
              If you didn't create an account with us, please ignore this email or contact our support team.
            </p>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 11px; text-align: center; margin: 0;">
              This is an automated email from Pre-Order System. Please do not reply to this email.
            </p>
          </div>
        </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ Verification OTP sent successfully to ${email}`);
    console.log("Message ID:", result.messageId);
    return true;
  } catch (error) {
    console.error("❌ Error sending verification email:", error);
    console.error("Error details:", {
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode,
    });
    return false;
  }
};

// Send password reset OTP
export const sendPasswordResetOTP = async (email, name, otp) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Password Reset - Pre-Order System",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>Hello ${name},</p>
          <p>We received a request to reset your password for your Pre-Order System account. Use the OTP below to reset your password:</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #dc3545; font-size: 32px; margin: 0;">${otp}</h1>
          </div>
          
          <p>This OTP will expire in 10 minutes for security reasons.</p>
          <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
          
          <hr style="margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">This is an automated email. Please do not reply.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Password reset OTP sent to ${email}`);
    return true;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return false;
  }
};
