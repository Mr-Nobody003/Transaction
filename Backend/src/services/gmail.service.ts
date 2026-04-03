import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

interface GmailOAuth2Auth {
    type: 'OAuth2';
    user: string;
    clientId: string;
    clientSecret: string;
    refreshToken: string;
}

interface GmailTransportConfig {
    service: 'gmail';
    auth: GmailOAuth2Auth;
}

interface MailPayload {
    to: string;
    subject: string;
    text: string;
    html: string;
}

const transporter: nodemailer.Transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER as string,
        clientId: process.env.CLIENT_ID as string,
        clientSecret: process.env.CLIENT_SECRET as string,
        refreshToken: process.env.REFRESH_TOKEN as string,
    },
} as GmailTransportConfig);

// Verify the connection configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('Error connecting to email server:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});

// Function to send email
const sendEmail = async (to: string, subject: string, text: string, html: string): Promise<void> => {
    try {
        const info: nodemailer.SentMessageInfo = await transporter.sendMail({
            from: `"Your Name" <${process.env.EMAIL_USER}>`, // sender address
            to, // list of receivers
            subject, // Subject line
            text, // plain text body
            html, // html body
        });

        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

//Function to send registration email
async function sendRegistrationEmail(userEmail:string,name:string) {
    const subject = "WELCOME TO TRANSACTION"
    const text = `Hello ${name} , \n \n Thankyou for registering with Transaction. We are excited to have you on board. \n \n Best reguards \n The TRANSACTION team`;
    const html = `<p>Hello ${name} ,</p> 
                    <p>Thankyou for registering with Transaction. We are excited to have you on board.</p> 
                    <p>Best reguards ,</p> <p>The TRANSACTION team </p>`;
    
    await sendEmail(userEmail,subject,text,html);
}

export default sendRegistrationEmail;