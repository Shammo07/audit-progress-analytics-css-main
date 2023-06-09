import nodemailer from "nodemailer"

export function getNodemailerConfig() {
    return {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    }
}

export function getEmailConnection(config) {
    let transporter = nodemailer.createTransport(config)
    return transporter
}

export function buildEmailPayload(from, to, cc = [], subject, text, html) {
    let payload = {
        from,
        to,
        subject
    }
    if (text) payload.text = text
    if (html) payload.html = html
}

export function getTestMessageUrl(info) {
    return nodemailer.getTestMessageUrl(info)
}

export async function sendEmailNotification(receiverEmailAddresses,ccEmailAddresses,subject,html,attachments){
    let nodemailerConfig=getNodemailerConfig()
    let transporter = getEmailConnection(nodemailerConfig)

    let info = await transporter.sendMail({
        // from: req.body.from.email,
        from: process.env.EMAIL_USERNAME,
        to: receiverEmailAddresses,
        cc:ccEmailAddresses,
        subject:subject,
        html,
        attachments
    })
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", getTestMessageUrl(info));
}
