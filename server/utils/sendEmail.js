import nodemailer from "nodemailer";

/**
 * Utility to send emails via Nodemailer.
 * Falls back to console simulation if SMTP details are missing.
 * @param {Object} options - { to, subject, text, html }
 */
const sendEmail = async (options) => {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT || 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  const hasCredentials = smtpHost && smtpUser && smtpPass;

  if (hasCredentials) {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort),
      secure: parseInt(smtpPort) === 465, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const mailOptions = {
      from: `"CodeFolio Notification" <${smtpUser}>`,
      to: options.to,
      replyTo: options.replyTo,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Real email sent successfully to ${options.to}: ${info.messageId}`);
    return info;
  } else {
    // Simulation / Development fallback
    console.log("\n==================================================");
    console.log("✉️  [SIMULATED EMAIL NOTIFICATION]");
    console.log(`TO:       ${options.to}`);
    if (options.replyTo) {
      console.log(`REPLY-TO: ${options.replyTo}`);
    }
    console.log(`SUBJECT:  ${options.subject}`);
    console.log("------------------ MESSAGE -----------------------");
    console.log(options.text);
    console.log("==================================================\n");

    return {
      messageId: `simulated-id-${Date.now()}`,
      previewUrl: "https://ethereal.email (simulated)"
    };
  }
};

export default sendEmail;
