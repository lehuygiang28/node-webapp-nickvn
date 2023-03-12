const nodemailer = require('nodemailer');
const util = require('util');
const { emailTemplate } = require('./email-template');
const path = require('path');

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
function sendMail(to, inputContent) {
    try {
        const emailImgFolderPath = path.resolve(__dirname, '../private/email-img/');
        const client = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_APP_PASSWORD,
            },
        });

        let mailTemplateHtml = emailTemplate(inputContent);
        client.sendMail({
            from: 'Sender',
            to: to,
            subject: inputContent.subject,
            // text: "",
            html: mailTemplateHtml,
            attachments: [
                {
                    filename: 'image-1.png',
                    path: path.resolve(emailImgFolderPath, 'image-1.png'),
                    cid: 'image-1',
                },
                {
                    filename: 'image-2.png',
                    path: path.resolve(emailImgFolderPath, 'image-2.png'),
                    cid: 'image-2',
                },
                {
                    filename: 'image-3.png',
                    path: path.resolve(emailImgFolderPath, 'image-3.png'),
                    cid: 'image-3',
                },
                {
                    filename: 'image-4.png',
                    path: path.resolve(emailImgFolderPath, 'image-4.png'),
                    cid: 'image-4',
                },
            ],
        });
        console.log(`Mail sent successful to: ${to}`);
        return true;
    } catch (error) {
        console.error('Error sending mail: ' + error);
        return false;
    }
}

module.exports = {
    sendMail,
    sendMailCallback,
};
