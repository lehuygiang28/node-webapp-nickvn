const Category = require('../models/Category');
const User = require('../models/User');
const LienMinh = require('../models/LienMinh');
const UserPuchased = require('../models/UserPuchased');
const { mongooseToObject, mutipleMongooseToObject } = require('../../util/mongoose');
const { sendMessage } = require('../../util/flash-message');
const { sendMail, sendMailCallback } = require('../../util/send_mail-nodemailer');
const { logger } = require('../../util/logger');
const { resetProductAndUserPuchased, generateLienMinh } = require('../../util/project_extensions');

class LienMinhController {

    // GET /lien-minh
    showLienMinhCategory(_req, res, next) {
        // generateLienMinh(5, next);
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

        let lienMinhQuery = LienMinh.find({ status_id: 1005 });
        logger.info(res.locals._sort);

        // if (_req._sort.hasOwnProperty('_sort')) {
        //     lienMinhQuery = lienMinhQuery.sort({
        //     });

        // }

        // Get all accounts lien-minh in the database
        lienMinhQuery
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
                                user.updatedAt = Date.now();

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
                // renewUserSession(_req, next);
                res.redirect('/lien-minh/acc-lien-minh');
            })
            .catch(next);
    }
}

// export default new ;
module.exports = new LienMinhController;