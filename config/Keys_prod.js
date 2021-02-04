// Keys used on production environment
module.exports = {
  mongoURI: process.env.MONGO_URI,
  secretOrKey: process.env.SECRET_OR_KEY,
  secretOrAdminKey: process.env.SECRET_OR_ADMIN_KEY,
  secretOrSuperAdminKey: process.env.SECRET_OR_SUPER_ADMIN_KEY,
  secretOrMailerKey: process.env.SECRET_OR_MAILER_KEY,
  mailAppEmail: process.env.MAIL_APP_EMAIL,
  mailAppPassword: process.env.MAIL_APP_PASSWORD,
  gravatarId: process.env.GRAVATAR_ID,
  gravatarNumbers: process.env.GRAVATAR_NUMBERS,
};
