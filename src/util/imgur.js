const { ImgurClient } = require('imgur');

/***
 * An functionality to upload image to imgur
 *
 * @param {string} img The image object to upload, it will be get a buffer
 * @returns {string} The link of the image
 */
async function UploadImage(img) {
    const client = new ImgurClient({
        clientId: process.env.IMGUR_CLIENT_ID,
        clientSecret: process.env.IMGUR_CLIENT_SECRET,
    });
    const response = await client.upload({
        image: img.data,
    });
    return response.data.link;
}

module.exports = { UploadImage };
