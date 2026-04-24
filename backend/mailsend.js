import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address from .env
    pass: process.env.EMAIL_PASS, // Your app password from .env
  },
})

function sendMail(to, sub, msg) {
  console.log("Attempting to send email to:", to)
  transporter.sendMail(
    {
      from: process.env.EMAIL_USER, // Sender address from .env
      to: to,
      subject: sub,
      html: msg,
    },
    (error, info) => {
      if (error) {
        console.error("Email error:", error)
      } else {
        console.log("Email sent:", info.response)
      }
    },
  )
}

// Comment out this test email to avoid unnecessary emails during startup
// sendMail("dar2ness009@gmail.com", "Haan bhai", "Kiase ho")

export { sendMail, transporter }
