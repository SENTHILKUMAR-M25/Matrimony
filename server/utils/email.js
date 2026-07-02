const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// ─── Cached logo (CID attachment) ──────────────────
const LOGO_PATH = path.join(__dirname, '..', 'assets', 'logo.png');
const LOGO_CID = 'logo@jod';
let LOGO_BUFFER = null;
try {
  LOGO_BUFFER = fs.readFileSync(LOGO_PATH);
} catch { /* logo not available */ }

// ─── Brand constants ───────────────────────────────
const BRAND = {
  name: 'JOD Matrimony',
  tagline: 'Find Your Perfect Life Partner',
  primary: '#7F55B1',
  primaryDark: '#5C3D82',
  secondary: '#9B7EBD',
  accent: '#F49BAB',
  accentLight: '#FFE1E0',
  bgLight: '#F8F4FC',
  textDark: '#2A1540',
  textMedium: '#5C3D82',
  textMuted: '#9B7EBD',
  white: '#FFFFFF',
  border: '#E4DAEE',
  website: 'https://jodmatrimony.com',
  supportEmail: 'support@jodmatrimony.com',
  phone: '+91 1234 567 890',
};

// ─── Transporter (lazy init) ───────────────────────
let _transporter = null;

const getTransporter = () => {
  if (_transporter) return _transporter;
  _transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: { rejectUnauthorized: false },
  });
  return _transporter;
};

const FROM_ADDRESS = process.env.SMTP_FROM
  ? process.env.SMTP_FROM
  : `"${BRAND.name}" <${process.env.SMTP_USER || 'noreply@jodmatrimony.com'}>`;

// ─── Retry helper ──────────────────────────────────
const retry = async (fn, maxAttempts = 2, delayMs = 1000) => {
  let lastErr;
  for (let i = 0; i < maxAttempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (i < maxAttempts - 1) await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw lastErr;
};

// ─── Send email ────────────────────────────────────
const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = getTransporter();
    const mailOptions = {
      from: FROM_ADDRESS,
      to,
      subject,
      html,
    };
    if (LOGO_BUFFER) {
      mailOptions.attachments = [{
        filename: 'logo.png',
        path: LOGO_PATH,
        cid: LOGO_CID,
      }];
    }
    const info = await retry(() => transporter.sendMail(mailOptions));
    console.log(`[EMAIL] Sent "${subject}" to ${to} — id: ${info.messageId}`);
    return info;
  } catch (err) {
    console.error(`[EMAIL] Failed to send "${subject}" to ${to}:`, err.message);
  }
};

// ─── HTML template wrapper ─────────────────────────
const emailLayout = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${BRAND.name}</title>
</head>
<body style="margin:0;padding:0;background-color:${BRAND.bgLight};font-family:'Segoe UI',Arial,Helvetica,sans-serif;-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.bgLight};">
    <tr>
      <td align="center" style="padding:30px 15px;">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:${BRAND.white};border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(127,85,177,0.08);">

          <!-- ─── Header ─── -->
          <tr>
            <td style="background:linear-gradient(135deg,${BRAND.primary} 0%,${BRAND.primaryDark} 100%);padding:32px 40px 24px;text-align:center;">
              ${LOGO_BUFFER ? `<img src="cid:${LOGO_CID}" alt="${BRAND.name}" width="48" height="48" style="display:block;margin:0 auto 12px;" />` : ''}
              <h1 style="margin:0;font-size:22px;font-weight:700;color:${BRAND.white};letter-spacing:0.5px;">${BRAND.name}</h1>
              <p style="margin:4px 0 0;font-size:13px;color:${BRAND.accentLight};opacity:0.9;">${BRAND.tagline}</p>
            </td>
          </tr>

          <!-- ─── Body ─── -->
          <tr>
            <td style="padding:32px 40px;background-color:${BRAND.white};">
              ${content}
            </td>
          </tr>

          <!-- ─── Footer ─── -->
          <tr>
            <td style="padding:24px 40px;background-color:${BRAND.bgLight};border-top:1px solid ${BRAND.border};">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="text-align:center;padding-bottom:12px;">
                    <a href="${BRAND.website}" style="display:inline-block;margin:0 6px;text-decoration:none;">
                      <span style="display:inline-block;width:32px;height:32px;line-height:32px;border-radius:50%;background-color:${BRAND.primary};color:${BRAND.white};font-size:14px;font-weight:bold;">f</span>
                    </a>
                    <a href="${BRAND.website}" style="display:inline-block;margin:0 6px;text-decoration:none;">
                      <span style="display:inline-block;width:32px;height:32px;line-height:32px;border-radius:50%;background-color:${BRAND.primary};color:${BRAND.white};font-size:14px;font-weight:bold;">in</span>
                    </a>
                    <a href="${BRAND.website}" style="display:inline-block;margin:0 6px;text-decoration:none;">
                      <span style="display:inline-block;width:32px;height:32px;line-height:32px;border-radius:50%;background-color:${BRAND.primary};color:${BRAND.white};font-size:14px;font-weight:bold;">X</span>
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="text-align:center;font-size:12px;color:${BRAND.textMuted};line-height:1.6;">
                    <p style="margin:0 0 4px;">
                      <a href="${BRAND.website}" style="color:${BRAND.primary};text-decoration:none;font-weight:600;">${BRAND.name}</a>
                    </p>
                    <p style="margin:0 0 4px;">123 Matrimony Tower, Mumbai, India</p>
                    <p style="margin:0 0 4px;">
                      <a href="tel:${BRAND.phone.replace(/\s/g,'')}" style="color:${BRAND.textMuted};text-decoration:none;">${BRAND.phone}</a>
                      &nbsp;|&nbsp;
                      <a href="mailto:${BRAND.supportEmail}" style="color:${BRAND.textMuted};text-decoration:none;">${BRAND.supportEmail}</a>
                    </p>
                    <p style="margin:8px 0 0;font-size:11px;color:${BRAND.textMuted};">
                      &copy; ${new Date().getFullYear()} ${BRAND.name}. All rights reserved.
                      <br>You received this email because you registered on our platform.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

// ─── CTA button helper ─────────────────────────────
const ctaButton = (text, url) => `
<table cellpadding="0" cellspacing="0" style="margin:20px auto;">
  <tr>
    <td align="center" style="background:linear-gradient(135deg,${BRAND.primary} 0%,${BRAND.primaryDark} 100%);border-radius:8px;padding:0;">
      <a href="${url}" target="_blank" style="display:inline-block;padding:14px 36px;font-size:15px;font-weight:700;color:${BRAND.white};text-decoration:none;border-radius:8px;letter-spacing:0.3px;">${text}</a>
    </td>
  </tr>
</table>`;

// ═══════════════════════════════════════════════════
// WELCOME EMAIL
// ═══════════════════════════════════════════════════
const buildWelcomeEmail = (firstName) => emailLayout(`
  <p style="margin:0 0 6px;font-size:14px;color:${BRAND.textMuted};text-transform:uppercase;letter-spacing:1.5px;">Welcome to ${BRAND.name}</p>
  <h2 style="margin:0 0 16px;font-size:24px;font-weight:700;color:${BRAND.textDark};line-height:1.3;">Hello ${firstName},</h2>
  <p style="margin:0 0 16px;font-size:15px;color:${BRAND.textMedium};line-height:1.7;">
    Thank you for creating your account with <strong>${BRAND.name}</strong>!
    We're excited to have you join our community of thousands of verified members seeking their perfect life partner.
  </p>

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.bgLight};border-radius:8px;padding:20px;margin:0 0 20px;">
    <tr>
      <td style="padding:0;">
        <h3 style="margin:0 0 12px;font-size:15px;color:${BRAND.primary};font-weight:700;">Your account has been successfully created!</h3>
        <p style="margin:0 0 6px;font-size:13px;color:${BRAND.textMedium};line-height:1.6;">
          <strong style="color:${BRAND.textDark};">Email:</strong> <span style="color:${BRAND.textMuted};">[ Registered Email ]</span>
        </p>
        <p style="margin:0;font-size:13px;color:${BRAND.textMedium};line-height:1.6;">
          <strong style="color:${BRAND.textDark};">Account Status:</strong>
          <span style="display:inline-block;padding:2px 10px;border-radius:4px;background-color:#d4edda;color:#155724;font-size:12px;font-weight:600;">Active</span>
        </p>
      </td>
    </tr>
  </table>

  <p style="margin:0 0 8px;font-size:14px;color:${BRAND.textMedium};line-height:1.7;">
    To get started, please complete your profile so other members can learn more about you.
    A complete profile with photos gets <strong style="color:${BRAND.primary};">10x more responses</strong>!
  </p>

  ${ctaButton('Complete Your Profile', `${BRAND.website}/dashboard/create-profile`)}

  <table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0 0;">
    <tr>
      <td style="padding:16px 20px;background-color:${BRAND.accentLight};border-radius:8px;">
        <p style="margin:0;font-size:13px;color:${BRAND.textMedium};line-height:1.6;">
          <strong style="color:${BRAND.textDark};">Need help?</strong>
          Reply to this email or contact our support team at
          <a href="mailto:${BRAND.supportEmail}" style="color:${BRAND.primary};text-decoration:none;font-weight:600;">${BRAND.supportEmail}</a>
        </p>
      </td>
    </tr>
  </table>

  <p style="margin:20px 0 0;font-size:14px;color:${BRAND.textMedium};line-height:1.7;">
    Warm regards,<br>
    <strong style="color:${BRAND.primary};">${BRAND.name} Team</strong>
  </p>
`);

// ═══════════════════════════════════════════════════
// APPRECIATION EMAIL
// ═══════════════════════════════════════════════════
const buildAppreciationEmail = (firstName) => emailLayout(`
  <p style="margin:0 0 6px;font-size:14px;color:${BRAND.textMuted};text-transform:uppercase;letter-spacing:1.5px;">Profile Created Successfully</p>
  <h2 style="margin:0 0 16px;font-size:24px;font-weight:700;color:${BRAND.textDark};line-height:1.3;">Congratulations ${firstName}!</h2>
  <p style="margin:0 0 16px;font-size:15px;color:${BRAND.textMedium};line-height:1.7;">
    We're delighted to inform you that your matrimonial profile has been created successfully
    on <strong>${BRAND.name}</strong>. Your profile is now live and visible to other members!
  </p>

  <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,${BRAND.primary} 0%,${BRAND.primaryDark} 100%);border-radius:8px;padding:24px;margin:0 0 20px;">
    <tr>
      <td style="padding:0;text-align:center;">
        <p style="margin:0 0 4px;font-size:32px;">&#10004;&#65039;</p>
        <h3 style="margin:0 0 4px;font-size:16px;color:${BRAND.white};font-weight:700;">Profile Completed!</h3>
        <p style="margin:0;font-size:13px;color:${BRAND.accentLight};opacity:0.9;">Your profile is now active and visible to potential matches</p>
      </td>
    </tr>
  </table>

  <p style="margin:0 0 16px;font-size:15px;color:${BRAND.textMedium};font-weight:600;">Here's what you can do now:</p>

  <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 16px;">
    <tr>
      <td style="padding:10px 16px;border-bottom:1px solid ${BRAND.border};">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="30" style="vertical-align:top;font-size:18px;color:${BRAND.primary};">&#128150;</td>
            <td style="font-size:13px;color:${BRAND.textMedium};line-height:1.6;">
              <strong style="color:${BRAND.textDark};">Browse Matches</strong><br>
              Discover compatible profiles based on your preferences
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:10px 16px;border-bottom:1px solid ${BRAND.border};">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="30" style="vertical-align:top;font-size:18px;color:${BRAND.primary};">&#128232;</td>
            <td style="font-size:13px;color:${BRAND.textMedium};line-height:1.6;">
              <strong style="color:${BRAND.textDark};">Express Interest</strong><br>
              Send interest to profiles you like and start conversations
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:10px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="30" style="vertical-align:top;font-size:18px;color:${BRAND.primary};">&#128222;</td>
            <td style="font-size:13px;color:${BRAND.textMedium};line-height:1.6;">
              <strong style="color:${BRAND.textDark};">Connect & Communicate</strong><br>
              Chat directly with interested members and find your perfect match
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

  <div style="text-align:center;margin:8px 0 0;">
    ${ctaButton('Start Finding Matches', `${BRAND.website}/dashboard/matches`)}
  </div>

  <table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0 0;">
    <tr>
      <td style="padding:16px 20px;background-color:${BRAND.accentLight};border-radius:8px;">
        <p style="margin:0 0 6px;font-size:13px;color:${BRAND.textMedium};line-height:1.6;">
          <strong style="color:${BRAND.textDark};">Pro Tip:</strong>
          Add a profile photo and complete your horoscope details to get
          <strong style="color:${BRAND.primary};">3x more match requests</strong>!
        </p>
      </td>
    </tr>
  </table>

  <p style="margin:20px 0 0;font-size:14px;color:${BRAND.textMedium};line-height:1.7;">
    Wishing you a wonderful journey ahead!<br>
    <strong style="color:${BRAND.primary};">${BRAND.name} Team</strong>
  </p>
`);

// ═══════════════════════════════════════════════════
// PASSWORD RESET EMAIL
// ═══════════════════════════════════════════════════
const buildPasswordResetEmail = (firstName, resetUrl, expiryMinutes) => emailLayout(`
  <p style="margin:0 0 6px;font-size:14px;color:${BRAND.textMuted};text-transform:uppercase;letter-spacing:1.5px;">Password Reset Request</p>
  <h2 style="margin:0 0 16px;font-size:24px;font-weight:700;color:${BRAND.textDark};line-height:1.3;">Hello ${firstName},</h2>
  <p style="margin:0 0 16px;font-size:15px;color:${BRAND.textMedium};line-height:1.7;">
    We received a request to reset the password for your <strong>${BRAND.name}</strong> account.
    Click the button below to set a new password.
  </p>

  ${ctaButton('Reset Password', resetUrl)}

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.bgLight};border-radius:8px;padding:16px 20px;margin:16px 0;">
    <tr>
      <td style="padding:0;">
        <p style="margin:0;font-size:13px;color:${BRAND.textMedium};line-height:1.6;">
          <strong style="color:${BRAND.textDark};">Link expires in:</strong> ${expiryMinutes} minutes<br>
          <strong style="color:${BRAND.textDark};">Note:</strong> This link can only be used once.
        </p>
      </td>
    </tr>
  </table>

  <p style="margin:0 0 16px;font-size:14px;color:${BRAND.textMedium};line-height:1.7;">
    If you didn't request a password reset, please ignore this email or
    <a href="mailto:${BRAND.supportEmail}" style="color:${BRAND.primary};text-decoration:none;font-weight:600;">contact support</a>
    if you have any concerns.
  </p>

  <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 0;border-left:3px solid ${BRAND.primary};padding-left:16px;">
    <tr>
      <td style="padding:0;">
        <p style="margin:0;font-size:13px;color:${BRAND.textMuted};line-height:1.5;">
          For security reasons, never share this link with anyone. Our team will never ask for your password.
        </p>
      </td>
    </tr>
  </table>

  <p style="margin:20px 0 0;font-size:14px;color:${BRAND.textMedium};line-height:1.7;">
    Warm regards,<br>
    <strong style="color:${BRAND.primary};">${BRAND.name} Team</strong>
  </p>
`);

module.exports = {
  sendWelcomeEmail: async (email, firstName) => {
    await sendEmail({
      to: email,
      subject: `Welcome to ${BRAND.name} — Complete Your Profile!`,
      html: buildWelcomeEmail(firstName),
    });
  },

  sendAppreciationEmail: async (email, firstName) => {
    await sendEmail({
      to: email,
      subject: `Congratulations ${firstName}! Your ${BRAND.name} Profile is Live`,
      html: buildAppreciationEmail(firstName),
    });
  },

  sendPasswordResetEmail: async (email, firstName, resetUrl, expiryMinutes) => {
    await sendEmail({
      to: email,
      subject: `Reset Your ${BRAND.name} Password`,
      html: buildPasswordResetEmail(firstName, resetUrl, expiryMinutes),
    });
  },
};
