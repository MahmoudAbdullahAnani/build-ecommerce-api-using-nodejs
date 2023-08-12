const nodemailer = require("nodemailer");

const sendEmail = async ({ email, subject, messageHTML, userName }) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "mahmoud18957321@gmail.com",
      pass: "fvaqocvivolzmjww",
    },
  });
  const mailOptions = {
    from: "Hi " + userName + "<mahmoud18957321@gmail.com>",
    to: email,
    subject: subject,
    html: messageHTML,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
