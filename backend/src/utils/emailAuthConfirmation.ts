import nodemailer from "nodemailer";

export const sendEmailConf = (senderEmail : string, otp: string) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        // port: 587,
        // secure: false, // use SSL
        auth: {
          user: process.env.APP_USERNAME,
          pass: process.env.APP_PASSWORD
        }
      });
      
      // Configure the mailoptions object
      const mailOptions = {
        from: 'accounts@staxfolio.com',
        to: `${senderEmail}`,
        subject: "Please verify your email address",
        text: `Your Staxfolio verfication code is: ${otp}`
      };
      
      // Send the email
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log("Error:", error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });      
}