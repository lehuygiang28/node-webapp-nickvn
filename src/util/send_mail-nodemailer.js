const console = require('console');
const nodemailer = require('nodemailer');
const util = require('util');
const { emailTemplate } = require('./email-template');

/***
 * Send an email to the user with the callback
 * @param {String} to The email adress to send
 * @param {Object} inputContent The content to send
 * @param callback The callback
 */
const sendMailCallback = util.callbackify(sendMail);

/***
 * Send an email to the user
 * @param {String} to The email adress to send
 * @param {Object} inputContent The content to send
 */
async function sendMail(to, inputContent) {
    const client = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_APP_PASSWORD
        }
    });
    // var content = '';
    // content += `
    //     <div style="padding: 10px; background-color: #003375">
    //         <div style="padding: 10px; background-color: white;">
    //             <h4 style="color: #0085ff">${inputContent.title}</h4>
    //             <span style="color: black">
    //                 ${inputContent.context}
    //             </span>
    //         </div>
    //     </div>
    // `;

    let mailTemplateHtml = emailTemplate(inputContent);
    console.log(mailTemplateHtml);

    client.sendMail({
        from: "Sender",
        to: to,
        subject: inputContent.subject,
        // text: "",
        html: mailTemplateHtml,
        attachments: [{
            filename: 'image-1.png',
            path: 'src/private/email-img/image-1.png',
            cid: 'image-1'
        }, {
            filename: 'image-2.png',
            path: 'src/private/email-img/image-2.png',
            cid: 'image-2'
        }, {
            filename: 'image-3.png',
            path: 'src/private/email-img/image-3.png',
            cid: 'image-3'
        }, {
            filename: 'image-4.png',
            path: 'src/private/email-img/image-4.png',
            cid: 'image-4'
        }]
    });
    console.log(`Mail sent successful to: ${to}`);
    console.log(inputContent);
}

module.exports = {
    sendMail,
    sendMailCallback
}