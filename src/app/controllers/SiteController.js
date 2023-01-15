const User = require('../models/User');
const Category = require('../models/Category');
const { mongooseToObject, mutipleMongooseToObject } = require('../../util/mongoose');
const { isEmailValid, isNullOrEmpty } = require('../../util/validators');
const { createHash } = require('../../util/bcrypt');
const bcrypt = require('bcrypt');
const { logger } = require('../../util/logger');
const mongoose = require('mongoose');

class SiteController {
    // GET homepage
    // GET /
    home(_req, res, next) {
        Category.find({})
            .then((categories) => {
                res.render('sites/home', {
                    categories: mutipleMongooseToObject(categories),
                });
            })
            .catch(next);
    }

    // GET /dang-xuat
    // Xoa session
    signout(_req, res, next) {
        try {
            if (_req.session.User) {
                _req.session.User = null;
                _req.session.destroy();
                console.log('Remove `user` session completed');
                return res.redirect('/?sout=' + 'true');
            } else {
                return res.redirect('/?sout=' + 'false');
            }
        } catch (error) {
            console.log('Destroy session error: ' + error);
            res.redirect('/?sout=' + 'false');
            next();
        }
    }

    // POST /dang-nhap
    // Xu li dang nhap form
    loginSolvers(_req, res, next) {
        if (_req.session.User) {
            return res.redirect(304, '/');
        }
        // const passwordHash = createHash(_req.body.password);
        // console.log(_req.body.username + _req.body.password + passwordHash);

        if (!_req.body.username || !_req.body.password) {
            return res
                .status(401)
                .render('sites/dang-nhap', { error: 'Tài khoản hoặc mật khẩu không chính xác !' });
        }

        // Find by username
        User.findOne({ userName: _req.body.username })
            .then((user) => {
                if (!user) {
                    logger.warn('User not found');
                    return res
                        .status(401)
                        .render('sites/dang-nhap', {
                            error: 'Tài khoản hoặc mật khẩu không chính xác !',
                        });
                }
                // Check password with hash function
                bcrypt.compare(
                    _req.body.password.toString(),
                    user.password,
                    async function (err, result) {
                        if (err) {
                            throw new Error(err);
                        } else if (!result) {
                            logger.info('Dang nhap that bai: ');
                            return res
                                .status(401)
                                .render('sites/dang-nhap', {
                                    error: 'Tài khoản hoặc mật khẩu không chính xác !',
                                });
                        }
                        logger.info('Dang nhap thanh cong: ');
                        // Set the session value
                        _req.session.User = {
                            _id: user._id,
                            userName: user.userName,
                            money: user.money,
                            role: user.role,
                        };
                        _req.session.Authen = true;

                        // Update last login time
                        user.lastLogin = Date.now();
                        user = await user.save();

                        res.redirect(302, '/');
                    },
                );
            })
            .catch(next);
    }

    // GET /dang-nhap
    login(_req, res) {
        if (_req.session.User) {
            return res.redirect(304, '/');
        }
        res.render('sites/dang-nhap');
    }

    // GET /dang-ky
    signup(_req, res) {
        if (_req.session.User) {
            return res.redirect(304, '/');
        }
        res.render('sites/dang-ky');
    }

    // POST /dang-ky
    signupSolvers(_req, res, next) {
        if (_req.session.User) {
            return res.redirect(304, '/');
        }

        if (
            !isNullOrEmpty(_req.body.userName) ||
            !isNullOrEmpty(_req.body.password) ||
            !isNullOrEmpty(_req.body.email) ||
            !isNullOrEmpty(_req.body.password_confirmation) ||
            !isNullOrEmpty(_req.body.phone)
        ) {
            return res
                .status(401)
                .render('sites/dang-ky', { error: 'Vui lòng điền đầy đủ các trường dữ liệu !' });
        }

        if (!isEmailValid(_req.body.email)) {
            return res.status(401).render('sites/dang-ky', { error: 'Email chưa đúng định dạng' });
        }
        if (_req.body.password != _req.body.password_confirmation) {
            return res.status(401).render('sites/dang-ky', { error: 'Mật khẩu phải giống nhau' });
        }

        User.findOne({
            $or: [
                { userName: _req.body.userName },
                { email: _req.body.email },
                { phone: _req.body.phone },
            ],
        })
            .then(async (user) => {
                if (user) {
                    if (user.userName === _req.body.userName) {
                        return res
                            .status(401)
                            .render('sites/dang-ky', { error: 'Tài khoản đã được sử dụng' });
                    } else if (user.email === _req.body.email) {
                        return res
                            .status(401)
                            .render('sites/dang-ky', { error: 'Email đã được sử dụng' });
                    } else if (user.phone === _req.body.phone) {
                        return res
                            .status(401)
                            .render('sites/dang-ky', { error: 'Số điện thoại đã được sử dụng' });
                    }
                }

                user = new User({
                    _id: mongoose.Types.ObjectId(),
                    userName: _req.body.userName,
                    email: _req.body.email,
                    phone: _req.body.phone,
                    password: createHash(_req.body.password),
                    fullName: _req.body.userName + _req.body.phone,
                    money: 0,
                    role: {
                        role_id: 3,
                        role_name_vi: 'Thành Viên',
                        role_name_en: 'Member',
                    },
                    status: 'active',
                    avatar: 'arr',
                    note: 'note',
                    createAt: Date.now(),
                    updateAt: Date.now(),
                    lastLogin: Date.now(),
                });
                await user.save();
                return res.status(201).render('sites/dang-ky', { success: 'Đăng ký thành công' });
            })
            .catch(next);
    }
}

// export default new SiteController;
module.exports = new SiteController();
