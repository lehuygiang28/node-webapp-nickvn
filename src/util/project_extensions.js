const LienMinh = require('../app/models/LienMinh');
const UserPuchased = require('../app/models/UserPuchased');
const { logger } = require('./logger');

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
    // Get last product_id from database
    LienMinh.findOne({ status_id: 1005 })
        .sort('-product_id')
        .then(async lienMinh => {
            let lastImg = lienMinh.product_id;
            console.log(`Max product_id ${lastImg}`);
            for (let i = 0; i < counters; i++) {
                lastImg++;
                let product = new LienMinh({
                    product_id: lastImg,
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
                afterImg.forEach(element => {
                    product.img.push(element);
                });
                // console.log(product);
                logger.info(product);
                await product.save();
            }
        })
        .catch(next);
}

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