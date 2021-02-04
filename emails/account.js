const nodemailer = require("nodemailer");
const { info: winstonInfo } = require("winston");

// Load utils
const { mailAppEmail, mailAppPassword } = require("../config/keys");

// Configure nodemailer with credentials
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: mailAppEmail, // Your email address
    pass: mailAppPassword, // Your password (or special app password)
  },
});

// Send mail to reset user password
async function sendResetPasswordEmail({ email, name }, token) {
  const url = `http://localhost:5000/api/naphtali/duniya/portfolio/auth_u/reset_user_password/${token}`;
  try {
    const html = `<b>Welcome to our reset service, ${name}!</b>
      <p>You requested for a password reset, if it is you, please</p>
      <p>Click on the link below to reset your password!!!</p>
      <a href=${url}>Reset Password</a><br/>
      <p>Or copy the link below and paste in your browser to reset password</p>
      <p>${url}</p>`;

    await transporter.sendMail({
      from: "Duniya Naphtali <noreply@kouqhar.com>",
      to: email,
      subject: "Reset your password!",
      text: `Welcome to our reset password service, ${name}!`,
      html,
    });
  } catch (error) {
    const errorMessage = `Sending Reset password email error ${error}`;
    winstonInfo(errorMessage);
    return errorMessage;
  }
}

// Send mail to reset super admin password
async function sendSuperAdminResetPasswordEmail({ email, name }, token) {
  const url = `http://localhost:5000/api/naphtali/duniya/portfolio/auth_a/kouqhar/super_admin_register/reset_super_admin_password/${token}`;
  try {
    const html = `<b>Welcome to our super admin reset service, ${name}!</b>
      <p>You requested for a password reset, if it is you, please</p>
      <p>Click on the link below to reset your password!!!</p>
      <a href=${url}>Reset Password</a><br/>
      <p>Or copy the link below and paste in your browser to reset password</p>
      <p>${url}</p>`;

    await transporter.sendMail({
      from: "Duniya Naphtali <noreply@kouqhar.com>",
      to: email,
      subject: "Reset your password!",
      text: `Welcome to our reset password service, ${name}!`,
      html,
    });
  } catch (error) {
    const errorMessage = `Sending Reset password email error ${error}`;
    winstonInfo(errorMessage);
    return errorMessage;
  }
}

// Send mail to welcome a new user
async function sendWelcomeEmail({ email, name }) {
  try {
    const html = `<b>A warm message of thanks to you ${name} for taking out time to sign up to my portfolio, if you have not yet dropped your testimonial, please click on the link below to make yours. Thanks ones more from Naphtali Duniya!</b>`;

    await transporter.sendMail({
      from: "Duniya Naphtali <noreply@kouqhar.com>",
      to: email,
      subject: "Thanks for joining!",
      text: `Welcome to my portfolio, ${name}!`,
      html,
    });
  } catch (error) {
    const errorMessage = `Sending welcome email error ${error}`;
    winstonInfo(errorMessage);
    return errorMessage;
  }
}

// Send mail to welcome a new super admin
async function sendSuperAdminWelcomeEmail({ email, name }) {
  try {
    const html = `<b>A warm message of thanks to you ${name} (super admin) for taking out time to sign up to my portfolio, if you have not yet dropped your testimonial, please click on the link below to make yours. Thanks ones more from Naphtali Duniya!</b>`;

    await transporter.sendMail({
      from: "Duniya Naphtali <noreply@kouqhar.com>",
      to: email,
      subject: "Thanks for joining!",
      text: `Welcome to my portfolio, ${name}!`,
      html,
    });
  } catch (error) {
    const errorMessage = `Sending super admin welcome email error ${error}`;
    winstonInfo(errorMessage);
    return errorMessage;
  }
}

// Send mail to inform user of a reset password success
async function sendInformResetPasswordEmail({ email, name }) {
  const url = `http://localhost:5000/api/naphtali/duniya/portfolio/auth_u/user_forgot_password`;
  try {
    const html = `<b>Hello ${name}, this is to inform you on a recent password change made on Naphtali Duniya's portfolio. Click on the link below to secure your account or simply ignore this mail if it was indeed you who made the recent change. Thanks.</b>
    <a href=${url}>Reset Password</a><br/>
    <p>Or copy the link below and paste in your browser to secure your account</p>
    <p>${url}</p>`;

    await transporter.sendMail({
      from: "Duniya Naphtali <noreply@kouqhar.com>",
      to: email,
      subject: "Account password reset successful!",
      text: `Password reset success, ${name}!`,
      html,
    });
  } catch (error) {
    const errorMessage = `Sending Inform Reset Password Email error ${error}`;
    winstonInfo(errorMessage);
    return errorMessage;
  }
}

// Send mail to inform super admin of a reset password success
async function sendSuperAdminInformResetPasswordEmail({ email, name }) {
  const url = `http://localhost:5000/api/naphtali/duniya/portfolio/auth_a/kouqhar/super_admin_register/super_admin_forgot_password`;
  try {
    const html = `<b>Hello ${name} (super admin), this is to inform you on a recent password change made on Naphtali Duniya's portfolio. Click on the link below to secure your account or simply ignore this mail if it was indeed you who made the recent change. Thanks.</b>
    <a href=${url}>Reset Password</a><br/>
    <p>Or copy the link below and paste in your browser to secure your account</p>
    <p>${url}</p>`;

    await transporter.sendMail({
      from: "Duniya Naphtali <noreply@kouqhar.com>",
      to: email,
      subject: "Account password reset successful!",
      text: `Password reset success, ${name}!`,
      html,
    });
  } catch (error) {
    const errorMessage = `Sending Inform Reset Password Email error ${error}`;
    winstonInfo(errorMessage);
    return errorMessage;
  }
}

// Send mail to a user that just left
async function sendCancellationEmail({ email, name }) {
  try {
    const html = `<b>I hope to see you back again someday, ${name}!</b>`;

    await transporter.sendMail({
      from: "Duniya Naphtali <noreply@kouqhar.com>",
      to: email,
      subject: "I am sorry to see you leave",
      text: `I hope to see you back again someday, ${name}!`,
      html,
    });
  } catch (error) {
    const errorMessage = `Sending email cancellation error ${error}`;
    winstonInfo(errorMessage);
    return errorMessage;
  }
}

module.exports = {
  sendWelcomeEmail,
  sendSuperAdminWelcomeEmail,
  sendCancellationEmail,
  sendResetPasswordEmail,
  sendSuperAdminResetPasswordEmail,
  sendInformResetPasswordEmail,
  sendSuperAdminInformResetPasswordEmail,
};
