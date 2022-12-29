const LienMinh = require('../app/models/LienMinh');
const UserPuchased = require('../app/models/UserPuchased');
const { logger } = require('./logger');


/**
 * Generates random product
 * @param {Number} counters The number of products to generate
 * @param next Call next middleware
 */
function generateLienMinh(counters, next) {
    const firstImg = [
        "/img/default-thumb1.webp",
        "/img/default-thumb2.webp",
        "/img/default-thumb3.webp",
        "/img/default-thumb4.webp",
        "/img/default-thumb5.webp",
        "/img/default-thumb6.webp",
        "/img/0qBPw7AiOQ_1632531413.jpg"
    ];
    const afterImg = [
        "/img/CM9q56zAnM_1632531413.jpg",
        "/img/pTWDgoJQuz_1632531413.jpg",
        "/img/zwRCsqMtyo_1632531413.jpg",
        "/img/HLpEr7ojZm_1632531414.jpg",
        "/img/xxuC88f0h9_1632531414.jpg"
    ];
    const rankRd = ["Chưa Rank", "Sắt", "Đồng", "Bạc", "Vàng", "Bạch Kim", "Kim Cương", "Cao Thủ", "Đại Cao Thủ", "Thách Đấu"];
    const NOT_SOLD = 1005;

    function randomString(length) {
        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    function randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    for (let i = 0; i < counters; i++) {
        let product = new LienMinh({
            userName: 'shop' + randomString(6),
            password: 'passw' + randomString(8),
            price: randomNumber(10000, 20000000),
            champ: randomNumber(20, 199),
            skin: randomNumber(50, 600),
            rank: rankRd[randomNumber(0, rankRd.length - 1)],
            status_account: 'Trắng thông tin',
            note: 'note',
            status_id: NOT_SOLD,
            status_name: 'Chưa bán',
            img: [
                firstImg[randomNumber(0, firstImg.length - 1)]
            ]
        });

        // Concat() is better than '...' (spread syntax ES6)
        // product.img.push(...afterImg);
        product.img = product.img.concat(afterImg);

        product.save()
            .then(() => {
                logger.info(`Add product successfully!`);
                logger.info(product);
            })
            .catch(next);
    }
    // })
    // .catch(next);
}

/**
 * Resets the state of the product and removes all references to it from the user
 * @param next Call next middleware
 * 
 * Step:
 * 
 *      1: Resets the state of the product to NOT_SOLD, id: 1005
 * 
 *      2: Remove all user puchase history
 * 
 *      3: Call next() middleware
 * 
 * User:
 *  abc: 100
 */
function resetProductAndUserPuchased(next) {
    LienMinh.find({ status_id: 1006 })
        .then(product => {
            if (!product) {
                logger.info('Not found product');
                return;
            }
            product.forEach(productItem => {
                productItem.status_id = 1005;
                productItem.status_name = 'Chưa bán';
                productItem.save();
                logger.info('Reset product');
            });
            UserPuchased.find({})
                .then(userPuchased => {
                    if (!userPuchased) {
                        logger.info('Not found puchased');
                        return;
                    }
                    userPuchased.forEach(userPuchasedItem => {
                        if (userPuchasedItem.product_puchased.length === 0) {
                            logger.info('Not found puchased');
                            return;
                        }
                        userPuchasedItem.product_puchased = []
                        userPuchasedItem.save();
                        logger.info('Reset puchased');
                    });
                })
                .catch(next);
            logger.info('Reset Successfull');
        })
        .catch(next);
}
module.exports = {
    resetProductAndUserPuchased,
    generateLienMinh
};