const User = require('../models/User');
const Category = require('../models/Category');
const { mongooseToObject, mutipleMongooseToObject } = require('../../util/mongoose');
const { isEmailValid, isNullOrEmpty } = require('../../util/validators');
const { createHash } = require('../../util/bcrypt');
const { renewUserSession } = require('../../util/renewSession');
const bcrypt = require('bcrypt');

class SiteController {

    // GET homepage
    async home(_req, res, next) {
        await renewUserSession(_req, next);
        Category.find({})
            .then(categories => res.render('sites/home', {
                categories: mutipleMongooseToObject(categories)
            }))
            .catch(next);
    }

    // GET /dang-xuat
    // Xoa session
    signout(_req, res, next) {
        try {
            if (_req.session.User) {
                _req.session.destroy(() => {
                    console.log('Destroy session completed');
                    return res.redirect('/?sout=' + 'true');
                });
            } else {
                return res.redirect('/?sout=' + 'false');
            }
        } catch (error) {
            console.log('Destroy session error: ' + error);
            next();
        }
    }

    // POST /dang-nhap
    // Xu li dang nhap form
    loginSolvers(_req, res, next) {
        // const passwordHash = createHash(_req.body.password);
        // console.log(_req.body.username + _req.body.password + passwordHash);

        // Find by username
        User.findOne({ userName: _req.body.username })
            .then(user => {
                if (!user) {
                    console.log('User not found');
                    res.status(401);
                    return res.render('sites/dang-nhap', { error: 'Tài khoản hoặc mật khẩu không chính xác !' });
                }
                // Check password with hash function
                bcrypt.compare(_req.body.password, user.password, async function(err, result) {
                    if (err) {
                        throw new Error(err);
                    } else if (!result) {
                        console.log('Dang nhap that bai: ' + result);
                        res.status(401);
                        return res.render('sites/dang-nhap', { error: 'Tài khoản hoặc mật khẩu không chính xác !' });
                    }
                    console.log('Dang nhap thanh cong: ' + result);

                    // Set the session value
                    _req.session.User = {
                        _id: user._id,
                        userName: user.userName,
                        money: user.money,
                        role: user.role
                    }

                    // Update last login time
                    user.lastLogin = Date.now();
                    user = await user.save();

                    console.log(_req.session.User);
                    res.redirect('/');
                });
            })
            .catch(next);
    }

    // GET dang-nhap
    login(_req, res) {
        res.render('sites/dang-nhap');
    }

    signup(_req, res) {
        res.render('sites/dang-ky');
    }

    signupSolvers(_req, res, next) {
        if (!isNullOrEmpty(_req.body.userName) || !isNullOrEmpty(_req.body.password) ||
            !isNullOrEmpty(_req.body.email) || !isNullOrEmpty(_req.body.password_confirmation) ||
            !isNullOrEmpty(_req.body.phone)) {
            return res.status(401).render('sites/dang-ky', { error: 'Vui lòng điền đầy đủ các trường dữ liệu !' });
        }

        if (!isEmailValid(_req.body.email)) {
            return res.status(401).render('sites/dang-ky', { error: 'Email chưa đúng định dạng' });
        }
        if (_req.body.password != _req.body.password_confirmation) {
            return res.status(401).render('sites/dang-ky', { error: 'Mật khẩu phải giống nhau' });
        }

        User.findOne({ $or: [{ userName: _req.body.userName }, { email: _req.body.email }, { phone: _req.body.phone }] })
            .then(async user => {

                if (user) {
                    if (user.userName === _req.body.userName) {
                        return res.status(401).render('sites/dang-ky', { error: 'Tài khoản đã được sử dụng' });
                    } else if (user.email === _req.body.email) {
                        return res.status(401).render('sites/dang-ky', { error: 'Email đã được sử dụng' });
                    } else if (user.phone === _req.body.phone) {
                        return res.status(401).render('sites/dang-ky', { error: 'Số điện thoại đã được sử dụng' });
                    }
                }

                user = new User({
                    userName: _req.body.userName,
                    email: _req.body.email,
                    phone: _req.body.phone,
                    password: createHash(_req.body.password),
                    fullName: _req.body.userName + _req.body.phone,
                    money: 0,
                    role: 'member',
                    status: 'active',
                    avatar: 'arr',
                    note: 'note',
                    createAt: Date.now(),
                    updateAt: Date.now(),
                    lastLogin: Date.now()
                });
                console.log(user);
                user = await user.save();
                return res.status(201).render('sites/dang-ky', { success: 'Đăng ký thành công' });
            })
            .catch(next);

    }

}

// export default new SiteController;
module.exports = new SiteController;