const AdminModel = require("../Model/adminModel");
const nodemailer = require('nodemailer');
const crypto = require("crypto");

const generateOtp = () =>{
    const otp = Math.floor(1000 + Math.random() * 9000);
    return otp;
    }

    const generateToken = () =>{
        const token = crypto.randomBytes(20).toString('hex');
        return token;
    }

    const sendVerificationEmail = async(email) =>{
        // console.log('email in mail.js',email);

        const otp = generateOtp();
        const token = generateToken();
        
        await AdminModel.updateOne({email},{otp,token})

        const tranporter = nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:"cr2972002@gmail.com",
                pass:"12345678"
            }
        })
              
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

    module.exports = sendVerificationEmail;

