"use server";

import { gmailTransporter } from "@/lib/gmailTransporter";

export async function sendVerificationEmailAction(email: string, otp: string) {
  try {
    console.log(`📧 Sending verification email to: ${email}`);

    if (!email || !otp) {
      throw new Error('Email and OTP are required');
    }

    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      throw new Error('Email service not configured');
    }

    await gmailTransporter.sendMail({
      from: `"EduFlow LMS" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'EduFlow LMS - Email Verification Code',
      text: `
                EduFlow LMS - Email Verification
                
                Hi there!
                
                Your verification code is: ${otp}
                
                This code expires in 10 minutes.
                
                If you didn't request this, please ignore this email.
                
                Best regards,
                The EduFlow Team
            `,
      html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>EduFlow LMS - Email Verification</title>
                    <style>
                        /* Reset styles */
                        * { margin: 0; padding: 0; box-sizing: border-box; }
                        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
                        table { border-collapse: collapse; width: 100%; }
                        
                        /* Mobile styles */
                        @media only screen and (max-width: 600px) {
                            .container { width: 100% !important; padding: 10px !important; }
                            .content { padding: 20px 15px !important; }
                            .header { padding: 20px 15px 15px !important; }
                            .otp-container { padding: 25px 15px !important; margin: 20px 0 !important; }
                            .otp-code { font-size: 28px !important; letter-spacing: 4px !important; }
                            .security-tips { padding: 20px 15px !important; margin: 20px 0 !important; }
                            .footer { padding: 20px 15px !important; }
                            h1 { font-size: 24px !important; }
                            h2 { font-size: 20px !important; }
                            .welcome-text { font-size: 14px !important; }
                        }
                    </style>
                </head>
                <body style="margin: 0; padding: 0; background-color: #f8fafc;">
                    <table role="presentation" style="width: 100%; background-color: #f8fafc; padding: 20px 0;">
                        <tr>
                            <td align="center">
                                <table class="container" role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
                                    
                                    <!-- Header -->
                                    <tr>
                                        <td class="header" style="background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); padding: 30px 20px 20px; text-align: center;">
                                            <h1 style="color: white; font-size: 28px; font-weight: 700; margin: 0 0 8px 0;">
                                                🎓 EduFlow LMS
                                            </h1>
                                            <p style="color: rgba(255,255,255,0.9); font-size: 16px; margin: 0; font-weight: 500;">
                                                Email Verification
                                            </p>
                                        </td>
                                    </tr>
                                    
                                    <!-- Content -->
                                    <tr>
                                        <td class="content" style="padding: 30px 25px;">
                                            
                                            <!-- Welcome Message -->
                                            <table role="presentation" style="width: 100%; margin-bottom: 25px;">
                                                <tr>
                                                    <td style="text-align: center;">
                                                        <h2 style="color: #1F2937; font-size: 22px; font-weight: 600; margin: 0 0 12px 0;">
                                                            Verify Your Email Address
                                                        </h2>
                                                        <p class="welcome-text" style="color: #6B7280; font-size: 16px; line-height: 1.5; margin: 0;">
                                                            Welcome to EduFlow! Please enter this verification code to complete your registration:
                                                        </p>
                                                    </td>
                                                </tr>
                                            </table>
                                            
                                            <!-- OTP Code Section -->
                                            <table role="presentation" style="width: 100%; margin: 25px 0;">
                                                <tr>
                                                    <td>
                                                        <div class="otp-container" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 16px; padding: 35px 20px; text-align: center; margin: 25px 0;">
                                                            <div style="background: rgba(255,255,255,0.15); border: 2px solid rgba(255,255,255,0.3); border-radius: 12px; padding: 20px; display: inline-block; min-width: 200px;">
                                                                <span class="otp-code" style="font-size: 36px; font-weight: bold; color: white; letter-spacing: 6px; font-family: 'Courier New', monospace; text-shadow: 0 2px 4px rgba(0,0,0,0.3); display: block; word-break: break-all;">
                                                                    ${otp}
                                                                </span>
                                                            </div>
                                                            <p style="color: rgba(255,255,255,0.9); margin: 15px 0 0 0; font-size: 14px; font-weight: 500;">
                                                                ⏰ This code expires in 10 minutes
                                                            </p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </table>
                                            
                                            <!-- Security Tips -->
                                            <table role="presentation" style="width: 100%; margin: 25px 0;">
                                                <tr>
                                                    <td>
                                                        <div class="security-tips" style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 25px 20px; margin: 25px 0;">
                                                            <h3 style="color: #374151; font-size: 16px; margin: 0 0 15px 0; font-weight: 600;">
                                                                🔒 Security Tips:
                                                            </h3>
                                                            <ul style="color: #6B7280; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.8;">
                                                                <li style="margin-bottom: 8px;">Never share this code with anyone</li>
                                                                <li style="margin-bottom: 8px;">EduFlow will never ask for this code via phone</li>
                                                                <li style="margin-bottom: 8px;">This code is only valid for 10 minutes</li>
                                                                <li>If you didn't request this, please ignore this email</li>
                                                            </ul>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </table>
                                            
                                        </td>
                                    </tr>
                                    
                                    <!-- Footer -->
                                    <tr>
                                        <td class="footer" style="background-color: #F9FAFB; padding: 25px 20px; text-align: center; border-top: 1px solid #E5E7EB;">
                                            <p style="color: #9CA3AF; margin: 0 0 10px 0; font-size: 14px;">
                                                Need help? Contact us at 
                                                <a href="mailto:${process.env.GMAIL_USER}" style="color: #4F46E5; text-decoration: none; font-weight: 500;">
                                                    ${process.env.GMAIL_USER}
                                                </a>
                                            </p>
                                            <p style="color: #9CA3AF; margin: 0; font-size: 12px;">
                                                © 2024 EduFlow LMS. Transforming Education Through Technology.
                                            </p>
                                        </td>
                                    </tr>
                                    
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
            `,
    });

    console.log('✅ Email sent successfully to:', email);
    return { success: true };

  } catch (error) {
    console.error('❌ Failed to send verification email:', error);
    throw error; // Let better-auth handle the error
  }
}

