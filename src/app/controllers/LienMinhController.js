const Category = require('../models/Category');
const User = require('../models/User');
const LienMinh = require('../models/LienMinh');
const UserPuchased = require('../models/UserPuchased');
const { mongooseToObject, mutipleMongooseToObject } = require('../../util/mongoose');
const { renewUserSession } = require('../../util/renewSession');
const { sendMessage } = require('../../util/flash-message');
const { sendMail, sendMailCallback } = require('../../util/send_mail-nodemailer');
const { logger } = require('../../util/logger');

class LienMinhController {

    // GET /lien-minh
    showLienMinhCategory(_req, res, next) {

        logger.bold().info('TEST Logger');

        // Get all the categories with keywords 'lien-minh'
        Category.findOne({ slug: _req.originalUrl.split('/').slice(1).join('/') })
            .then(category => res.render('lien-minh/lien-minh', {
                category: mongooseToObject(category)
            }))
            .catch(next);

        function generateLienMinh(counters) {
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
        // generateLienMinh(4);

    }

    // GET /lien-minh/acc-lien-minh
    showAccLienMinh(_req, res, next) {
        // Get all accounts lien-minh in the database
        LienMinh.find({ status_id: 1005 })
            .then(lienminhs => res.render('lien-minh/acc-lien-minh', {
                lienminhs: mutipleMongooseToObject(lienminhs)
            }))
            .catch(next);
    }

    // Get lien-minh/acc-lien-minh/:id
    showChiTietAccLienMinhCategory(_req, res, next) {

        // console.log('ID Slug: ' + _req.params.id);
        logger.info('ID Slug: ' + _req.params.id);

        // Find product by product_id, if exists return product to view, otherwise return error msg
        LienMinh.findOne({ product_id: _req.params.id })
            .then(acc => {
                if (!acc) {
                    return res.render('lien-minh/acc-lien-minh', { err: 'Can not find acc' });
                }
                res.render('lien-minh/chi-tiet-acc-lien-minh', {
                    acc: mongooseToObject(acc)
                });
            })
            .catch(next);
    }

    // Get lien-minh/acc-lien-minh/:id/buy
    buyNowSolvers(_req, res, next) {
        // console.log('ID Slug: ' + _req.params.id);
        logger.info('ID Slug Buy: ' + _req.params.id);

        // console.log('URL: ' + url);
        // _req.flash('error', 'Bạn phải đăng nhập trước khi mua');
        // sendMessage(_req, res, next, {type: 'error', message: 'Bạn phải đăng nhập trước khi mua'});
        // res.redirect(url);

        // Check session if not login, otherwise...
        if (!_req.session.User) {
            // _req.session.sessionFlash = {
            //   type: 'error',
            //   message: 'Bạn phải đăng nhập trước khi mua'
            // }
            sendMessage(_req, res, next, { error: true, message: 'Bạn phải đăng nhập trước khi mua' });
            return res.redirect('/lien-minh/acc-lien-minh');
        }

        // Find the product by id
        LienMinh.findOne({ product_id: _req.params.id })
            .then(acc => {
                if (!acc) {
                    // Send the error message to views
                    sendMessage(_req, res, next, { error: true, message: 'Không tìm thấy tài khoản' });
                    return res.redirect('/lien-minh/acc-lien-minh');
                }
                if (acc.status_id != 1005) {
                    sendMessage(_req, res, next, { error: true, message: 'Tài khoản đã được bán' });
                    return res.redirect('/lien-minh/acc-lien-minh');
                }
                // Check user is existing
                User.findById(_req.session.User._id)
                    .then(user => {
                        if (!user) {
                            // Send the error message to views
                            sendMessage(_req, res, next, { error: true, message: 'Bạn phải đăng nhập trước khi mua' });
                            return res.redirect('/lien-minh/acc-lien-minh/');
                        }

                        // console.log(`User ID: ${user._id}`);
                        logger.info(`User ID: ${user._id}`);

                        // Find the cart by id
                        UserPuchased.findOne({ user_id: user._id })
                            .then(async userPuchased => {
                                // If cart is not existing, create the new one
                                if (!userPuchased) {
                                    // Define the new cart
                                    let newPuchased = new UserPuchased({
                                        user_id: user._id,
                                        product_puchased: [{
                                            product_obj_id: acc._id,
                                            product_id: acc.product_id,
                                            price: acc.price,
                                            created_at: Date.now()
                                        }]
                                    });
                                    // Save the new cart to the database and callback logger
                                    newPuchased.save(() => {
                                        // console.log(`Create new puchase objId: ${newId}`);
                                        logger.info(`Create new puchase objId: ${newId}`);
                                    });
                                } else {
                                    // If cart is existing, update the cart
                                    userPuchased.product_puchased.push({
                                        product_obj_id: acc._id,
                                        product_id: acc.product_id,
                                        price: acc.price,
                                        created_at: Date.now()
                                    });
                                    userPuchased.save(() => {
                                        // console.log(`Update puchase objId: ${userPuchased._id}`);
                                        logger.info(`Update puchase objId: ${userPuchased._id}`);
                                    });
                                }

                                // Change status of product
                                acc.status_id = 1006;
                                acc.status_name = "Đã bán";
                                // Subtraction money of user when buy product
                                user.money -= acc.price;

                                // Save new status of product & new money of user
                                await acc.save();
                                await user.save();

                                // Send email to user
                                sendMailCallback(user.email, {
                                    subject: 'Thông tin tài khoản đã mua tại giang.cf',
                                    title: `Thông tin tài khoản đã mua #${acc.product_id}`,
                                    context: `Tài khoản: ${acc.userName}<br>Mật khẩu: ${acc.password}`
                                }, () => {
                                    logger.info(`Mail sent successful to: ${user.email}`);
                                });
                            })
                            .catch(next);
                    })
                    .catch(next);

                // Send the error message to views
                sendMessage(_req, res, next, { success: true, message: 'Mua tài khoản thành công, thông tin tài khoản đã được gửi về email của bạn.' });
                renewUserSession(_req, next);
                res.redirect('/lien-minh/acc-lien-minh');
            })
            .catch(next);
    }
}

// export default new ;
module.exports = new LienMinhController;