const nodemailer = require('nodemailer');
const { getMaxListeners } = require('../Model/adminModel');

const generateOtp = () =>{
    const otp = Math.floor(1000 + Math.random() * 9000);
    return otp;
    }

    const verifyMail = (email) =>{

        console.log('email in mail.js',email);
        
        const tranporter = nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:"cr2972002@gmail.com",
                pass:"12345678"
            }
        })
        
        const otp = generateOtp();
        
        const mailOptions =  {
            from: 'your_email@example.com',
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is: ${otp}`
        }
        
        tranporter.sendMail(mailOptions,(err,info)=>{
            if(err) {console.log(err);
            // res.send('Error sending OTP. Please try again later.');
        }
            else
           { console.log('Email sent: ' + info.response);}
        })
    }

    module.exports = verifyMail;

