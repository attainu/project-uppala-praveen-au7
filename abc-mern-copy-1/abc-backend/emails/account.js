const sgMail = require("@sendgrid/mail")
require("dotenv/config")

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendEmailVerificationLink = async (req,res,next) => {
    const msg = {
        to: req.body.email, 
        from: 'uppalapraveen0707@gmail.com', 
        subject: 'Account Verification',
       
        html: `
        <h2> Please click on the below link to verify your account </h2>
        <a href= "https://abcapp123.netlify.app/?register=${req.token}">click on this link to verify your account</a>
        `,
      }
      sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent')
        res.json({success:true,message:"please activate the account by verifying your email"})
      })
      .catch((error) => {
        console.error(error,error.response.body.errors)
        res.json({success:false,error:error.response.body.errors})
      })

}

const sendResetPasswordLink = async (req,res,next) => {
    const msg = {
        to: req.body.email, 
        from: 'uppalapraveen0707@gmail.com', 
        subject: 'Reset Password',
       
        html: `
        <h2> Please click on the below link to reset your password </h2>
        <a href= "https://abcapp123.netlify.app/resetPassword/${req.token}">click on this link to reset your password</a>
        `,
      }
      sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent')
        res.json({success:true,message:"Please reset the password by clicking the reset-password link, which is sent to your email"})
      })
      .catch((error) => {
        console.error(error,error.response.body.errors)
        res.json({success:false,error:error.response.body.errors})
      })

}

module.exports = { sendEmailVerificationLink,sendResetPasswordLink }






   