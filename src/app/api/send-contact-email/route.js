import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { name, email, message, recipient } = await request.json();

    // Validate inputs
    if (!name || !email || !message || !recipient) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Configure email transporter
    // Note: For production, use your actual SMTP credentials
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Email content
    const mailOptions = {
      from: `"Contact Form" <${process.env.SMTP_USER}>`,
      to: recipient,
      subject: `New Contact Form Submission from ${name}`,
      text: `
Name: ${name}
Email: ${email}

Message:
${message}
      `,
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
  <h2 style="color: #7c3aed; margin-bottom: 20px;">New Contact Form Submission</h2>
  
  <div style="margin-bottom: 20px; padding: 15px; background-color: #f9fafb; border-radius: 8px;">
    <p style="margin: 0 0 10px 0;"><strong>Name:</strong> ${name}</p>
    <p style="margin: 0 0 10px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #7c3aed; text-decoration: none;">${email}</a></p>
  </div>
  
  <div style="margin-bottom: 20px;">
    <h3 style="color: #4b5563; margin-bottom: 10px;">Message:</h3>
    <p style="white-space: pre-line; background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 0;">${message}</p>
  </div>
  
  <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">This email was sent from the contact form on your website.</p>
</div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
} 