const nodemailer = require('nodemailer');

// Create transporter based on environment
const createTransporter = () => {
  if (process.env.NODE_ENV === 'production') {
    // Production email configuration (e.g., SendGrid, Mailgun, etc.)
    return nodemailer.createTransporter({
      service: 'gmail', // or your preferred service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  } else {
    // Development - use Ethereal for testing
    return nodemailer.createTransporter({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'ethereal.user@ethereal.email',
        pass: 'ethereal.pass'
      }
    });
  }
};

// Email templates
const templates = {
  merchantApproved: (merchantName, businessName) => ({
    subject: 'Welcome to LocalMarket - Your Merchant Account is Approved! 🎉',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Congratulations!</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 18px;">Your merchant account has been approved</p>
        </div>
        
        <h2 style="color: #333;">Hello ${merchantName},</h2>
        
        <p style="color: #666; line-height: 1.6;">
          Great news! Your merchant account for <strong>${businessName}</strong> has been approved and is now active on LocalMarket.
        </p>
        
        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #0369a1; margin-top: 0;">What you can do now:</h3>
          <ul style="color: #666; line-height: 1.6;">
            <li>Start listing your products</li>
            <li>Manage your inventory</li>
            <li>Receive and process orders</li>
            <li>Connect with local customers</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/dashboard" 
             style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            Go to Dashboard
          </a>
        </div>
        
        <p style="color: #666; line-height: 1.6;">
          If you have any questions, feel free to reach out to our support team.
        </p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #999; font-size: 14px; text-align: center;">
          Welcome to the LocalMarket community!<br>
          <a href="${process.env.FRONTEND_URL}" style="color: #10b981;">LocalMarket</a>
        </p>
      </div>
    `
  }),

  merchantRejected: (merchantName, reason) => ({
    subject: 'LocalMarket Merchant Application Update',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #ef4444; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Application Update</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 18px;">Regarding your merchant application</p>
        </div>
        
        <h2 style="color: #333;">Hello ${merchantName},</h2>
        
        <p style="color: #666; line-height: 1.6;">
          Thank you for your interest in becoming a LocalMarket merchant. After reviewing your application, we're unable to approve it at this time.
        </p>
        
        ${reason ? `
        <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
          <h3 style="color: #dc2626; margin-top: 0;">Reason:</h3>
          <p style="color: #666; margin-bottom: 0;">${reason}</p>
        </div>
        ` : ''}
        
        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #0369a1; margin-top: 0;">Next steps:</h3>
          <ul style="color: #666; line-height: 1.6;">
            <li>Review the feedback provided</li>
            <li>Make necessary improvements to your business information</li>
            <li>You can reapply in the future</li>
            <li>Contact our support team if you have questions</li>
          </ul>
        </div>
        
        <p style="color: #666; line-height: 1.6;">
          We appreciate your interest in LocalMarket and encourage you to apply again once you've addressed the concerns mentioned above.
        </p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #999; font-size: 14px; text-align: center;">
          <a href="${process.env.FRONTEND_URL}" style="color: #10b981;">LocalMarket</a> - Supporting Local Communities
        </p>
      </div>
    `
  }),

  organicApproved: (merchantName, productName) => ({
    subject: 'Organic Certification Approved ✅',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🌱 Organic Certified!</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 18px;">Your product certification has been approved</p>
        </div>
        
        <h2 style="color: #333;">Hello ${merchantName},</h2>
        
        <p style="color: #666; line-height: 1.6;">
          Great news! Your organic certification for <strong>${productName}</strong> has been approved.
        </p>
        
        <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="color: #065f46; margin: 0; font-weight: bold;">
            🌱 Your product is now marked as "Certified Organic" and will be featured in organic product searches.
          </p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/dashboard" 
             style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            View Product
          </a>
        </div>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #999; font-size: 14px; text-align: center;">
          <a href="${process.env.FRONTEND_URL}" style="color: #10b981;">LocalMarket</a>
        </p>
      </div>
    `
  }),

  organicRejected: (merchantName, productName, reason) => ({
    subject: 'Organic Certification Review Update',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #f59e0b; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Certification Update</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 18px;">Regarding your organic certification</p>
        </div>
        
        <h2 style="color: #333;">Hello ${merchantName},</h2>
        
        <p style="color: #666; line-height: 1.6;">
          Thank you for submitting your organic certification for <strong>${productName}</strong>. After review, we're unable to approve the certification at this time.
        </p>
        
        ${reason ? `
        <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
          <h3 style="color: #dc2626; margin-top: 0;">Reason:</h3>
          <p style="color: #666; margin-bottom: 0;">${reason}</p>
        </div>
        ` : ''}
        
        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="color: #666; margin: 0;">
            You can resubmit your organic certification with updated documentation through your merchant dashboard.
          </p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/dashboard" 
             style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            Go to Dashboard
          </a>
        </div>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #999; font-size: 14px; text-align: center;">
          <a href="${process.env.FRONTEND_URL}" style="color: #10b981;">LocalMarket</a>
        </p>
      </div>
    `
  })
};

// Send email function
const sendEmail = async (to, templateName, templateData) => {
  try {
    const transporter = createTransporter();
    const template = templates[templateName];
    
    if (!template) {
      throw new Error(`Email template '${templateName}' not found`);
    }
    
    const { subject, html } = template(...templateData);
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'LocalMarket <noreply@localmarket.com>',
      to,
      subject,
      html
    };
    
    if (process.env.NODE_ENV !== 'production') {
      // In development, log the email instead of sending
      console.log('📧 Email would be sent:');
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log('HTML content logged to email-preview.html');
      
      // Optionally save to file for preview
      const fs = require('fs');
      fs.writeFileSync('email-preview.html', html);
      
      return { messageId: 'dev-mode', preview: true };
    }
    
    const result = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${to}: ${subject}`);
    return result;
    
  } catch (error) {
    console.error('📧 Email sending error:', error);
    throw error;
  }
};

module.exports = {
  sendEmail,
  templates
};