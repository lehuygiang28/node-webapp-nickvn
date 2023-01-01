const User = require('../models/User');
const { mongooseToObject, mutipleMongooseToObject } = require('../../util/mongoose');
const { sendMessage } = require('../../util/flash-message');
const { logger } = require('../../util/logger');
const { createHash, compare } = require('../../util/bcrypt');
const UserPuchased = require('../models/UserPuchased');
const LienMinh = require('../models/LienMinh');
// const bcrypt = require('bcrypt');


class UserController {

    // GET /user
    // GET /user/thong-tin-tai-khoan
    index(_req, res, next) {
        if (!_req.session.User) {
            sendMessage(_req, res, next, { error: true, message: 'Bạn chưa đăng nhập' });
            return res.redirect('/dang-nhap');
        }

        User.findOne({ _id: _req.session.User._id })
            .then(user => {
                if (!user) {
                    sendMessage(_req, res, next, { error: true, message: 'Bạn chưa đăng nhập' });
                    return res.redirect('/dang-nhap');
                }
                // console.log(user);
                res.render('user/thong-tin-tai-khoan', { user: mongooseToObject(user) });
            })
            .catch(next);
    }

    // GET /user/doi-mat-khau
    changePassword(_req, res, next) {
        if (!_req.session.User) {
            sendMessage(_req, res, next, { error: true, message: 'Bạn chưa đăng nhập!' });
            return res.redirect('/dang-nhap');
        }
        res.render('user/doi-mat-khau');
    }

    // POST /user/doi-mat-khau
    changePasswordSolvers(_req, res, next) {
        if (!_req.session.User) {
            sendMessage(_req, res, next, { error: true, message: 'Bạn chưa đăng nhập' });
            return res.redirect('/dang-nhap');
        }

        if (!_req.body || !_req.body.old_password || !_req.body.new_password || !_req.body.password_confirmation) {
            return res.render('user/doi-mat-khau', { error: 'Bạn phải điền đầy đủ các trường!' });
        }

        if (_req.body.new_password != _req.body.password_confirmation) {
            return res.render('user/doi-mat-khau', { error: 'Hai mật khẩu phải giống nhau!' });
        }

        User.findOne({ _id: _req.session.User._id })
            .then(user => {
                compare(_req.body.old_password, user.password, function(err, result) {
                    if (err) {
                        logger.error('Đổi mật khẩu thất bại: ' + err);
                        return res.render('user/doi-mat-khau', { error: 'Có lỗi xảy ra, vui lòng thử lại!' });
                    } else if (!result) {
                        logger.warn('Đổi mật khẩu thất bại');
                        res.status(401);
                        return res.render('user/doi-mat-khau', { error: 'Mật khẩu cũ không chính xác!' });
                    } else {
                        user.password = createHash(_req.body.new_password);
                        user.save().then(() => {
                            logger.info(`Đổi mật khẩu thành công userName: ${user.userName}`);
                            res.render('user/doi-mat-khau', { success: 'Đổi mật khẩu thành công!' });
                        });
                    }
                });
            })
            .catch(next);
    };

    // GET /user/tai-khoan-da-mua
    puchased(_req, res, next) {
        if (!_req.session.User) {
            return res.redirect('/dang-nhap');
        }

        /***
         * If not found user_puchased return without any data
         * If found user_puchased but not found any puchased return without any data
         * Otherwise return an array of user_puchased.product_puchased
         */
        UserPuchased.findOne({ user_id: _req.session.User._id }).populate({path: 'product_puchased.product'})
            .then(userPuchased => {
                if (!userPuchased) {
                    logger.debug('1 in');
                    return res.render('user/tai-khoan-da-mua');
                } else if (userPuchased.product_puchased.length === 0) {
                    logger.debug('2 in');
                    return res.render('user/tai-khoan-da-mua');
                } else {
                    logger.debug('Sucess in');
                    // logger.debug(userPuchased);
                    // console.log(mutipleMongooseToObject(userPuchased.product_puchased.product));

                    // res.json(mutipleMongooseToObject(userPuchased.product_puchased));
                    
                    return res.render('user/tai-khoan-da-mua', {
                        product_puchased: mutipleMongooseToObject(userPuchased.product_puchased),
                    })
                }
            })
            .catch(next);
        // res.render('user/tai-khoan-da-mua');
    }

}

// export default new UserController;
module.exports = new UserController;