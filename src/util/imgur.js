const { ImgurClient } = require('imgur');
const client = new ImgurClient({
    clientId: process.env.IMGUR_CLIENT_ID,
    clientSecret: process.env.IMGUR_CLIENT_SECRET,
});

/***
 * An functionality to upload image to imgur
 *
 * @param {string} img The image object to upload, it will be get a buffer
 * @returns {string} The link of the image
 */
async function UploadImage(img) {
    const response = await client.upload({
        image: img.data,
    });
    return response.data;
}

/***
 * An functionality to remove image from imgur
 *
 * @param {string} deletehash The string of image hash to delete
 * @returns {string} True if the image was successfully removed, otherwise false
 */
function DeleteImage(deletehash) {
    try {
        client.deleteImage(deletehash);
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

module.exports = { UploadImage, DeleteImage };
