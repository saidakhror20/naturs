const nodemailer = require('nodemailer');
const catchAsync = require('./catchAsync');
const sendEmail = async options =>{
    const transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "2668e83d864fea",
            pass: "3eb5fc335f580f"
        },
        tls: {
            secureProtocol: "TLSv1_method"
            // do not fail on invalid certs
            // rejectUnauthorized: false,
            // ciphers:'SSLv3'
          },
    })
    const mailOptions = {
        from : 'Saidakhror <admin@gmail.com>',
        to:options.email,
        subject:options.subject,
        text:options.message
    }
    await transporter.sendMail(mailOptions, (error, info)=>{
        if(error){
            console.log(error);
        }
        console.log('Message sent');
    })
}
module.exports = sendEmail;
// vdohzeaalsgnlyzp 