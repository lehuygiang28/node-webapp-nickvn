const Category = require('../models/Category');
const User = require('../models/User');
const LienMinh = require('../models/LienMinh');
const UserPuchased = require('../models/UserPuchased');
const { mongooseToObject, mutipleMongooseToObject } = require('../../util/mongoose');
const { sendMessage } = require('../../util/flash-message');
const { sendMail, sendMailCallback } = require('../../util/send_mail-nodemailer');
const { logger } = require('../../util/logger');
const { resetProductAndUserPuchased, generateLienMinh } = require('../../util/project_extensions');
const db = require('../../config/db');
const mongoose = require('mongoose');

class LienMinhController {

    // GET /lien-minh
    showLienMinhCategory(_req, res, next) {
        // generateLienMinh(3, next);
        // resetProductAndUserPuchased()
        logger.bold().info('TEST Logger');

        // Get all the categories with keywords 'lien-minh'
        Category.findOne({ slug: _req.originalUrl.split('/').slice(1).join('/') })
            .then(category => res.render('lien-minh/lien-minh', {
                category: mongooseToObject(category)
            }))
            .catch(next);

        // resetProductAndUserPuchased(next);
    }

    // GET /lien-minh/acc-lien-minh
    showAccLienMinh(_req, res, next) {
        // generateLienMinh(4, next);
        let lienMinhQuery = LienMinh.find({ status_id: 1005 });
        logger.info(res.locals._sort);

        // if (_req._sort.hasOwnProperty('_sort')) {
        //     lienMinhQuery = lienMinhQuery.sort({
        //     });

        // }

        // Get all accounts lien-minh in the database
        lienMinhQuery
            .then(lienminhs => {

                // const a = lienminhs.forEach((item) => {
                //     if (item.product_id == 564){
                //         console.log(item);
                //     }
                // })

                res.render('lien-minh/acc-lien-minh', {
                    lienminhs: mutipleMongooseToObject(lienminhs)
                });
            })
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
        // logger.info('ID Slug Buy: ' + _req.params.id);

        // Check session if not login, otherwise...
        if (!_req.session.User) {
            sendMessage(_req, res, next, { error: true, message: 'Bạn phải đăng nhập trước khi mua' });
            return res.redirect('/lien-minh/acc-lien-minh');
        }

        // Find the product by id
        LienMinh.findOne({ product_id: _req.params.id })
            .then(account => {
                // Unblock scoped of object product(account)
                let acc = account;

                // Check product is existing
                if (!acc) {
                    // Send the error message to views
                    sendMessage(_req, res, next, { error: true, message: 'Không tìm thấy tài khoản' });
                    return res.redirect('/lien-minh/acc-lien-minh');
                }
                if (acc.status_id != 1005) {
                    sendMessage(_req, res, next, { error: true, message: 'Tài khoản đã được bán' });
                    return res.redirect('/lien-minh/acc-lien-minh');
                }

                User.findById(_req.session.User._id)
                    .then(userFound => {
                        // Unblock scoped of object user
                        let user = userFound;

                        // Check user is existing
                        if (!user) {
                            // Send the error message to views
                            sendMessage(_req, res, next, { error: true, message: 'Bạn phải đăng nhập trước khi mua' });
                            return res.redirect('/lien-minh/acc-lien-minh/');
                        }
                        // console.log(`User ID: ${user._id}`);
                        // logger.info(`User ID: ${user._id}`);

                        // Find the cart by id
                        UserPuchased.findOneAndUpdate({ user_id: user._id })
                            .then(async userPuchasedFound => {
                                // Unblock scoped of object userPuchased
                                let userPuchased = userPuchasedFound;

                                // If cart is not existing, create the new one
                                if (!userPuchased) {
                                    // Define the new cart
                                    userPuchased = new UserPuchased({
                                        user_id: user._id,
                                        product_puchased: [{
                                            product: acc,
                                            created_at: Date.now()
                                        }, ]
                                    });

                                } else {
                                    // If cart is existing, update the cart
                                    userPuchased.product_puchased.push({
                                        product: acc,
                                        created_at: Date.now()
                                    });
                                }

                                // Change status of product
                                acc.status_id = 1006;
                                acc.status_name = "Đã bán";
                                // Subtraction money of user when buy product
                                user.money -= acc.price;
                                user.updatedAt = Date.now();

                                // Update the buy request(update user, acc, puchased)
                                let isUpdateSuccess = updateAll(user, acc, userPuchased);

                                if (isUpdateSuccess) {
                                    // Send email to user
                                    sendMailCallback(user.email, {
                                        subject: 'Thông tin tài khoản đã mua tại giang.cf',
                                        title: `Thông tin tài khoản đã mua #${acc.product_id}`,
                                        // context: `Tài khoản: ${acc.userName}<br>Mật khẩu: ${acc.password}`,
                                        heading: `Xin chào, bạn đã mua thành công tài khoản ${acc.game.name} mã số ${acc.product_id}!`,
                                        userName: acc.userName.toString(),
                                        password: acc.password.toString(),
                                    }, () => {
                                        logger.info(`Mail sent successful to: ${user.email}`);
                                    });
                                    sendMessage(_req, res, next, { success: true, message: 'Mua tài khoản thành công, thông tin tài khoản đã được gửi về email của bạn.' });
                                    return res.redirect('/lien-minh/acc-lien-minh');
                                } else {
                                    throw new Error();
                                }

                                /***
                                 * Function to update the [user, product, product_puchased] when buy product
                                 * 
                                 * @param {Object} user Object of user
                                 * @param {Object} acc Object of product
                                 * @param {Object} puchased Object of product_puchased
                                 * @returns {boolean} Return true if update is succesfully, otherwise return false
                                 */
                                async function updateAll(user, acc, puchased) {
                                    const session = await mongoose.startSession();
                                    session.startTransaction();
                                    try {
                                        await user.save();
                                        await acc.save();
                                        await puchased.save()
                                        await session.commitTransaction();
                                        return true;
                                    } catch (err) {
                                        logger.error(`Error when saving buy: ${err}`);
                                        await session.abortTransaction();
                                        return false;
                                    } finally {
                                        session.endSession();
                                    }
                                }

                            })
                            .catch((err) => {
                                logger.error(err);
                                logger.error(err.message);

                                sendMessage(_req, res, next, { error: true, message: "Có lỗi xảy ra khi mua hàng" });
                                return res.redirect('/lien-minh/acc-lien-minh');
                            });
                    })
                    .catch(next);

                // Send the error message to views
                // sendMessage(_req, res, next, { success: true, message: 'Mua tài khoản thành công, thông tin tài khoản đã được gửi về email của bạn.' });
                // // renewUserSession(_req, next);
                // res.redirect('/lien-minh/acc-lien-minh');
            })
            .catch(next);
    }
}

// export default new ;
module.exports = new LienMinhController;