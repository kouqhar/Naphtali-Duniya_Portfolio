# naphtaliduniyaportfolio :rocket: :metal:

This is a personal portfolio of Naphtali Duniya, a Full-Stack web developer.

# About Me :octocat:

Hi! I am Naphtali Duniya! A passionate and pragmatic Full-Stack developer with experience building websites and web applications. Over the years of learning, practice, and teaching, I've learned to be a more independent developer who can flip a problem with a solution, use the help of search engines, stack overflow, team of developers, communities and any other means of finding a solution to a problem. I work with JavaScript and have comfortable knowledge with Bootstrap, jQuery, and nodeJs. Also, experience working with Html5, Css3, Scss, Git, and ReactJs.

My mission is to make coding and web development accessible and flexible to everyone through knowledgeable contents that are simple to digest, and also practical to implement.

# Contact Me :sparkles:

**Email**

- If you are looking to get ahold of me, you can send me an email [Email : Naphtali Duniya](mailto:naphtaliduniya2@gmail.com)

**Social Media**

- Instagram [Instagram : Naphtali Duniya](https://www.instagram.com/_kouqhar) '**recommended**'

* Via Twitter [Twitter : Naphtali Duniya](https://twitter.com/kouqhar)

**Telephone**

- Call +234 (0)81 664 661 73

# Installation

You can use this on the server side, just run the following command to install dependencies after cloning the repo.

```
npm install
```

Also, change directory to client and run the same command above to install dependencies for the client or front end. Or simply run the command below from the root directory to perform the same operation.

```
npm run client-install
```

# Getting Started

To get you application working, create an export a `keys_dev.js` file in the `config` folder and paste the below configuration in the file with your custom values to run configuration locally.

```javascript
module.exports = {
  mongoURI: "mongodb://localhost:27017/database-Name",
  secretOrKey: "your-secret-key-for-the-application",
  secretOrMailerKey: "random-mailer-secret-key",
  mailAppEmail: "your-email-address",
  mailAppPassword: "your-password-to-above-email",
};
```

Or, create an export a `keys_prod.js` file in the `config` folder and paste the below configuration in the file to run configuration on production.

```javascript
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

### Mailer Note

To be able to send mail via g-mail, be sure to set `less secure` on the g-mail account provided above.

---

### Cloudinary Note

To get you cloudinary working, create an export a `cloudinary_dev.js` file in the `utils/Cloudinary` folder and paste the below configuration in the file with your the actual values to run configuration locally.

```javascript
// Import the cloudinary dependency
const cloudinary = require("cloudinary").v2;

// Configure cloudinary in development
cloudinary.config({
  cloud_name: "Your-cloudinary-cloud-name",
  api_key: "Your-cloudinary-api_key-",
  api_secret: "Your-cloudinary-api_secret",
});

module.exports = cloudinary;
```

Or, create an export a `cloudinary_prod.js` file in the `utils/Cloudinary` folder and paste the below configuration in the file to run configuration on production.

```javascript
const cloudinary = require("cloudinary").v2;

// Configure cloudinary in production
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = { cloudinary };
```

# Error Logging

If your run into an error, winston logger has been enabled to handle different types of unhandled exceptions, such as :

> All files with the **Root-dir** as `Destination` has a `.log` extension.

| Error      |     File Name      | Destination | Level |
| ---------- | :----------------: | :---------: | ----: |
| MongoDB    |        log         |  Database   |  Info |
| MongoDB    |      logFile       |  Root-dir   |  Info |
| Exceptions |     exceptions     |  Root-dir   | Error |
| Rejections |     rejections     |  Root-dir   | Error |
| Uncaught   | uncaughtExceptions |  Root-dir   | Error |

# Deployment

Before deploying your application to the web, Minify or Optimize your `client` application by running the `npm build` react command to optimize your application.
