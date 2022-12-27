const User = require('../models/User');
const { mongooseToObject, mutipleMongooseToObject } = require('../../util/mongoose');
const { sendMessage } = require('../../util/flash-message');


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

    // GET /user/change-password
    changePassword(_req, res, next) {
        if (!_req.session.User) {
            sendMessage(_req, res, next, { error: true, message: 'Bạn chưa đăng nhập' });
            return res.redirect('/dang-nhap');
        }
    }

    // GET /user/puchased
    puchased(_req, res, next) {

    }

}

// export default new UserController;
module.exports = new UserController;