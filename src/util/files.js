const path = require('path');
const fs = require('fs');

function removeFile(pathName) {
    // Remove a slash from the begin of path if exists
    pathName = pathName.toString();
    pathName = pathName.charAt(0) === '/' || pathName.charAt(0) === '\\' ? pathName.substring(1) : pathName;
    pathName = path.resolve('./src/public', pathName);
    console.log(pathName);
    fs.stat(pathName, function (err, stats) {
        console.log(stats); //here we got all information of file in stats variable

        if (err) {
            return console.error(err);
        }

        fs.unlink(pathName, function (err) {
            if (err) return console.log(err);
            console.log('file deleted successfully');
        });
    });
}

module.exports = { removeFile: removeFile };
