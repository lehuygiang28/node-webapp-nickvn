const nodemailer = require('nodemailer');
const util = require('util');

const sendMailCallback = util.callbackify(sendMail);

async function sendMail(to, inputContent) {
    const client = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_APP_PASSWORD
        }
    });
    var content = '';
    content += `
        <div style="padding: 10px; background-color: #003375">
            <div style="padding: 10px; background-color: white;">
                <h4 style="color: #0085ff">${inputContent.title}</h4>
                <span style="color: black">
                    ${inputContent.context}
                </span>
            </div>
        </div>
    `;

    client.sendMail({
        from: "Sender",
        to: to,
        subject: inputContent.subject,
        // text: "",
        html: content
    });
    console.log(`Mail sent successful to: ${to}`);
    console.log(inputContent);
}

module.exports = {
    sendMail,
    sendMailCallback
}