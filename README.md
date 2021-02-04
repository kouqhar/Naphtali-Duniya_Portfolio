# naphtaliduniyaportfolio

This is a personal portfolio of Naphtali Duniya, a Full-Stack web developer.

# About Me

Hi! I am Naphtali Duniya! A passionate and pragmatic Full-Stack developer with experience building websites and web applications. Over the years of learning, practice, and teaching, I've learned to be a more independent developer who can flip a problem with a solution, use the help of search engines, stack overflow, team of developers, communities and any other means of finding a solution to a problem. I work with JavaScript and have comfortable knowledge with Bootstrap, jQuery, and nodeJs. Also, experience working with Html5, Css3, Scss, Git, and ReactJs.

My mission is to make coding and web development accessible and flexible to everyone through knowledgeable contents that are simple to digest, and also practical to implement.

# Contact Me

**Email**
If you are looking to get ahold of me, you can send me an email NAPHTALI DUNIYA[Email](mailto:naphtaliduniya2@gmail.com)

**Social Media**

- Instagram NAPHTALI DUNIYA [Instagram](https://www.instagram.com/_kouqhar) 'recommended'

* Via Twitter NAPHTALI DUNIYA [Twitter](https://twitter.com/kouqhar)

**Telephone**
Call +234 (0)81 664 661 73

# Installation

You can use this on the server side, just run the following command to install dependencies after cloning the repo.

```
npm install
```

Also, change directory to client and run the same command above to install dependencies for the client or front end.

# Getting Started

To get you application working, create an export a `keys_dev.js` file in the `config` folder and paste the below configuration in the file with your custom values to run configuration locally.

```
module.exports = {
  mongoURI: "mongodb://localhost:27017/database-Name",
  secretOrKey: "your-secret-key-for-the-application",
  secretOrMailerKey: "random-mailer-secret-key",
  mailAppEmail: "your-email-address",
  mailAppPassword: "your-password-to-above-email",
};
```

Or, create an export a `keys_prod.js` file in the `config` folder and paste the below configuration in the file to run configuration on production.

```
module.exports = {
  mongoURI: process.env.MONGO_URI,
  secretOrKey: process.env.SECRET_OR_KEY,
  secretOrMailerKey: process.env.SECRET_OR_MAILER_KEY,
  mailAppEmail: process.env.MAIL_APP_EMAIL,
  mailAppPassword: process.env.MAIL_APP_PASSWORD,
};
```

# Note

The `client` folder is for the `Front-End`.
Other files and folders in the root directory are for the server side.

This repo has a Super Admin feature, if you are stuck, have any question or interested in using this feature, please use the contact me section above to get a hold of me.

---

## Mailer Note

To be able to send mail via g-mail, be sure to set `less secure` on the g-mail account provided above.

# Deployment

Before deploying your application to the web, Minify or Optimize your `client` application by running the `npm build` react command to optimize your application.
