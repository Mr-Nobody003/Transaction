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
            from: `"TRANSACTION" <${process.env.EMAIL_USER}>`, // sender address
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
async function sendRegistrationEmail(userEmail: string, name: string) {
    const subject = "WELCOME TO TRANSACTION"
    const text = `Hello ${name} , \n \n Thankyou for registering with Transaction. We are excited to have you on board. \n \n Best reguards \n The TRANSACTION team`;
    const html = `<p>Hello ${name} ,</p> 
                    <p>Thankyou for registering with Transaction. We are excited to have you on board.</p> 
                    <p>Best reguards ,</p> <p>The TRANSACTION team </p>`;

    await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionNotificationEmail_debited_USER(UserEmail: string, name: string, amount: number, transactionId: string) {
    const subject = "TRANSACTION SUCCESSFULLY PROCESSED"
    const text = `Hello ${name} , \n \n A transaction of amount ${amount} has been processed with transaction ID: ${transactionId}. If you did not authorize this transaction, please contact support immediately. \n \n Best reguards \n The TRANSACTION team`;
    const html = `<p>Hello ${name} ,</p> 
                    <p>A transaction of amount ${amount} has been (debited) processed with transaction ID: ${transactionId}. If you did not authorize this transaction, please contact support immediately.</p> 
                    <p>Best reguards ,</p> <p>The TRANSACTION team </p>`;
    await sendEmail(UserEmail, subject, text, html);
}

async function sendTransactionNotificationEmail_credited_USER(UserEmail: string, name: string, amount: number, transactionId: string) {
    const subject = "TRANSACTION CREDITED TO YOUR ACCOUNT"
    const text = `Hello ${name} , \n \n A transaction of amount ${amount} has been credited to your account with transaction ID: ${transactionId}. If you did not authorize this transaction, please contact support immediately. \n \n Best reguards \n The TRANSACTION team`;
    const html = `<p>Hello ${name} ,</p> 
                    <p>A transaction of amount ${amount} has been credited to your account with transaction ID: ${transactionId}. If you did not authorize this transaction, please contact support immediately.</p> 
                    <p>Best reguards ,</p> <p>The TRANSACTION team </p>`;
    await sendEmail(UserEmail, subject, text, html);
}

async function sendTransactionFailureEmail(userEmail: string, name: string, amount: number, transactionId: string) {
    const subject = "TRANSACTION FAILURE ALERT"
    const text = `Hello ${name} , \n \n We regret to inform you that a transaction of amount ${amount} with transaction ID: ${transactionId} has failed. Please check your account and try again. If the issue persists, contact support for assistance. \n \n Best reguards \n The TRANSACTION team`;
    const html = `<p>Hello ${name} ,</p> 
                    <p>We regret to inform you that a transaction of amount ${amount} with transaction ID: ${transactionId} has failed. Please check your account and try again. If the issue persists, contact support for assistance.</p> 
                    <p>Best reguards ,</p> <p>The TRANSACTION team </p>`;
    await sendEmail(userEmail, subject, text, html);
}



export {
    sendRegistrationEmail,
    sendTransactionNotificationEmail_debited_USER,
    sendTransactionNotificationEmail_credited_USER,
    sendTransactionFailureEmail
};