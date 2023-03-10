const LienMinh = require('../app/models/LienMinh');
const User = require('../app/models/User');
const UserPuchased = require('../app/models/UserPuchased');
const Category = require('../app/models/Category');
const { logger } = require('./logger');

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

/**
 * Generates random product
 * @param {Number} counters The number of products to generate
 * @param next Call next middleware
 */
function generateLienMinh(counters, next) {
    const firstImg = [
        '/img/default-thumb1.webp',
        '/img/default-thumb2.webp',
        '/img/default-thumb3.webp',
        '/img/default-thumb4.webp',
        '/img/default-thumb5.webp',
        '/img/default-thumb6.webp',
        '/img/0qBPw7AiOQ_1632531413.jpg',
    ];
    const afterImg = [
        '/img/CM9q56zAnM_1632531413.jpg',
        '/img/pTWDgoJQuz_1632531413.jpg',
        '/img/zwRCsqMtyo_1632531413.jpg',
        '/img/HLpEr7ojZm_1632531414.jpg',
        '/img/xxuC88f0h9_1632531414.jpg',
    ];
    const rankRd = [
        'Chưa Rank',
        'Sắt',
        'Đồng',
        'Bạc',
        'Vàng',
        'Bạch Kim',
        'Kim Cương',
        'Cao Thủ',
        'Đại Cao Thủ',
        'Thách Đấu',
    ];
    const NOT_SOLD = 1005;

    for (let i = 0; i < counters; i++) {
        let product = new LienMinh({
            userName: 'shop' + randomString(6),
            password: 'passw' + randomString(8),
            game: {
                name: 'Liên Minh',
            },
            price: randomNumber(10000, 20000000),
            champ: randomNumber(20, 199),
            skin: randomNumber(50, 600),
            rank: rankRd[randomNumber(0, rankRd.length - 1)],
            status_account: 'Trắng thông tin',
            note: 'note',
            status: {
                id: NOT_SOLD,
                name_en: 'available',
                name_vi: 'có sẵn',
            },
            imgur: [
                {
                    link: firstImg[randomNumber(0, firstImg.length - 1)],
                    deletehash: 'localfile',
                },
            ],
        });

        // Concat() is better than '...' (spread syntax ES6)
        // product.img.push(...afterImg);
        // product.img = product.img.concat(afterImg);

        afterImg.forEach((i) => {
            product.imgur.push({ link: i });
        });

        product
            .save()
            .then(() => {
                logger.info(`Add product successfully!`);
                logger.info(product);
            })
            .catch(next);
    }
}

/**
 * Generates random product
 * @param {Number} counters The number of products to generate
 * @param next Call next middleware
 */
async function generateLienMinhAtFirstTime(counters, next) {
    let isExistData = await LienMinh.countDocuments();
    if (isExistData) {
        return;
    }
    const firstImg = [
        '/img/default-thumb1.webp',
        '/img/default-thumb2.webp',
        '/img/default-thumb3.webp',
        '/img/default-thumb4.webp',
        '/img/default-thumb5.webp',
        '/img/default-thumb6.webp',
        '/img/0qBPw7AiOQ_1632531413.jpg',
    ];
    const afterImg = [
        '/img/CM9q56zAnM_1632531413.jpg',
        '/img/pTWDgoJQuz_1632531413.jpg',
        '/img/zwRCsqMtyo_1632531413.jpg',
        '/img/HLpEr7ojZm_1632531414.jpg',
        '/img/xxuC88f0h9_1632531414.jpg',
    ];
    const rankRd = [
        'Chưa Rank',
        'Sắt',
        'Đồng',
        'Bạc',
        'Vàng',
        'Bạch Kim',
        'Kim Cương',
        'Cao Thủ',
        'Đại Cao Thủ',
        'Thách Đấu',
    ];
    const NOT_SOLD = 1005;

    for (let i = 0; i < counters; i++) {
        let product = new LienMinh({
            userName: 'shop' + randomString(6),
            password: 'passw' + randomString(8),
            game: {
                name: 'Liên Minh',
            },
            price: randomNumber(10000, 20000000),
            champ: randomNumber(20, 199),
            skin: randomNumber(50, 600),
            rank: rankRd[randomNumber(0, rankRd.length - 1)],
            status_account: 'Trắng thông tin',
            note: 'note',
            status: {
                id: NOT_SOLD,
                name_en: 'available',
                name_vi: 'có sẵn',
            },
            imgur: [
                {
                    link: firstImg[randomNumber(0, firstImg.length - 1)],
                    deletehash: 'localfile',
                },
            ],
        });

        afterImg.forEach((i) => {
            let objectLink = { link: i, deletehash: 'localfile' };
            product.imgur.push(objectLink);
        });

        product
            .save()
            .then(() => {
                logger.info(`Add product successfully!`);
                logger.info(product);
            })
            .catch(next);
    }
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
 */
function resetProductAndUserPuchased(next) {
    LienMinh.find({ 'status.id': 1006 })
        .then((product) => {
            if (!product) {
                logger.info('Not found product');
                return;
            }
            product.forEach((productItem) => {
                productItem.status_id = 1005;
                productItem.status_name = 'Chưa bán';
                productItem.status = {
                    status_id: 1005,
                    name_vi: 'Chưa bán',
                    name_en: 'available',
                };
                productItem.save();
            });
            logger.info('Reset product successfully');
            UserPuchased.deleteMany({})
                .then(() => logger.info('Reset puchased successfully'))
                .catch(next);
        })
        .catch(next);
}

/**
 * Generates first of users
 * @param next Call next middleware
 */
async function generateCategoriesAtFirstTime() {
    const isNotNull = await Category.countDocuments();
    if (isNotNull) {
        return;
    }

    const fs = require('fs');
    const path = require('path');

    let data = fs.readFileSync(path.resolve(__dirname, `data.json`), 'utf8');
    let objectVar = JSON.parse(data);

    for (const element of objectVar.category) {
        let category = new Category();
        Object.assign(category, element);
        category.total = Number(element.total);
        await Category.insertMany(category);
    }
}

async function generateUsersAtFirstTime(next) {
    const isNotNull = await User.countDocuments();
    if (isNotNull) {
        return;
    }

    const fs = require('fs');
    const path = require('path');

    let data = fs.readFileSync(path.resolve(__dirname, `data.json`), 'utf8');
    let objectVar = JSON.parse(data);

    for (const element of objectVar.user) {
        let user = new User({});
        Object.assign(user, element);
        user.total = Number(element.total);
        User.insertMany(user);
    }
}

module.exports = {
    resetProductAndUserPuchased,
    generateLienMinh,
    generateLienMinhAtFirstTime,
    generateCategoriesAtFirstTime,
    generateUsersAtFirstTime,
};
