import nodemailer from 'nodemailer';

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export interface InvitationEmailData {
  to: string;
  tenantName: string;
  inviterName: string;
  role: string;
  invitationUrl: string;
}

export async function sendInvitationEmail(data: InvitationEmailData): Promise<boolean> {
  try {
    const mailOptions = {
      from: `"${data.tenantName}" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: data.to,
      subject: `You're invited to join ${data.tenantName}`,
      html: generateInvitationEmailHTML(data),
      text: generateInvitationEmailText(data),
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Invitation email sent:', result.messageId);
    return true;
  } catch (error) {
    console.error('Error sending invitation email:', error);
    return false;
  }
}

function generateInvitationEmailHTML(data: InvitationEmailData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invitation to join ${data.tenantName}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
        <h1 style="color: #2c3e50; margin-bottom: 20px;">You're Invited!</h1>
        <p style="font-size: 18px; margin-bottom: 30px;">
          <strong>${data.inviterName}</strong> has invited you to join 
          <strong>${data.tenantName}</strong> as a <strong>${data.role}</strong>.
        </p>
        
        <div style="background-color: white; padding: 30px; border-radius: 8px; margin: 30px 0;">
          <h2 style="color: #2c3e50; margin-bottom: 20px;">What's Next?</h2>
          <p style="margin-bottom: 20px;">
            Click the button below to accept your invitation and create your account:
          </p>
          
          <a href="${data.invitationUrl}" 
             style="display: inline-block; background-color: #3498db; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0;">
            Accept Invitation
          </a>
          
          <p style="font-size: 14px; color: #666; margin-top: 20px;">
            This invitation will expire in 7 days. If you can't click the button above, 
            copy and paste the following link into your browser:
          </p>
          <p style="font-size: 12px; color: #999; word-break: break-all;">
            ${data.invitationUrl}
          </p>
        </div>
        
        <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
          <p style="font-size: 14px; color: #666;">
            If you weren't expecting this invitation, you can safely ignore this email.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateInvitationEmailText(data: InvitationEmailData): string {
  return `
You're Invited!

${data.inviterName} has invited you to join ${data.tenantName} as a ${data.role}.

Click the link below to accept your invitation and create your account:
${data.invitationUrl}

This invitation will expire in 7 days.

If you weren't expecting this invitation, you can safely ignore this email.
  `;
}

export async function testEmailConnection(): Promise<boolean> {
  try {
    await transporter.verify();
    console.log('Email server connection verified');
    return true;
  } catch (error) {
    console.error('Email server connection failed:', error);
    return false;
  }
}
