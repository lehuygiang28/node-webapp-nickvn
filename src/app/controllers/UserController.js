const User = require('../models/User');
const { mongooseToObject, mutipleMongooseToObject } = require('../../util/mongoose');
const { sendMessage } = require('../../util/flash-message');
const { logger } = require('../../util/logger');
const bcrypt = require('bcrypt');
const { createHash, compare } = require('../../util/bcrypt');


class UserController {
    // GET /user
    // GET /user/profile
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
                console.log(user);
                res.render('user/profile', { user: mongooseToObject(user) });

                // sendMailCallback('gianghuytv28@gmail.com', {
                //     subject: 'Thông tin tài khoản đã mua tại giang.cf',
                //     title: 'Thông tin tài khoản đã mua',
                //     context: `Tài khoản: ${user.userName}<br>Mật khẩu: ${user.password}`
                // }, () => {
                //     console.log('CALLBACK CALLED');
                //     console.log(`Email sent to ${user.email}`);
                //     sendMessage(_req, res, next, { success: true, message: 'Mua tài khoản thành công, thông tin tài khoản đã được gửi về email của bạn' });
                // });

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

    // GET /user/puchased
    puchased(_req, res, next) {
        res.render('user/tai-khoan-da-mua', {});
    }

}

// export default new UserController;
module.exports = new UserController;