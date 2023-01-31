const User = require('../models/User');
const { sendMessage } = require('../../util/flash-message');
const { createHash, compare, compareSync } = require('../../util/bcrypt');
const { logger } = require('../../util/logger');
const { mongooseToObject, mutipleMongooseToObject } = require('../../util/mongoose');
const DISABLE_LAYOUT_PARTIALS = { layout: 'admin_without_partials' };

class AdminController {
    // Get /admin/
    index(req, res, next) {
        const ENABLE_LAYOUT_PARTIALS = res.locals.layout;
        if (!req.session.adminUser) {
            return res.redirect('/admin/login');
        }
        return res.render('admin', { ENABLE_LAYOUT_PARTIALS });
    }

    // GET /admin/login
    async login(req, res, next) {
        let adminUser;
        if (req.session.adminUser) {
            adminUser = await User.findById(req.session.adminUser._id).catch(next);
            if (adminUser) {
                switch (adminUser.role.role_name_en.toLowerCase()) {
                    case 'admin':
                    case 'moderator':
                        Object.assign(req.session.adminUser, {
                            _id: adminUser._id,
                            userName: adminUser.userName,
                            role: adminUser.role.role_name_en,
                        });
                        return res.redirect('/admin');
                    case 'member':
                        sendMessage(req, res, next, {
                            error: 'Tài khoản hoặc mật khẩu không chính xác!',
                        });
                        return res.render('admin/login', DISABLE_LAYOUT_PARTIALS);
                }
            }

            sendMessage(req, res, next, {
                error: 'Tài khoản hoặc mật khẩu không chính xác!',
            });
            res.render('admin/login', DISABLE_LAYOUT_PARTIALS);
        }

        res.render('admin/login', DISABLE_LAYOUT_PARTIALS);
    }

    // POST /admin/login
    async loginSolvers(req, res, next) {
        let userInput = {
            userName: req.body.user_name.toString() || undefined,
            password: req.body.password.toString() || undefined,
        };

        // Check username and password is not empty
        if (!userInput.userName || !userInput.password) {
            sendMessage(req, res, next, {
                error: 'Tài khoản hoặc mật khẩu không chính xác!',
            });
            return res.status(401).render('admin/login', DISABLE_LAYOUT_PARTIALS);
        }

        // Find the user in database with username
        let userFound = await User.findOne({ userName: userInput.userName });
        if (!userFound) {
            sendMessage(req, res, next, {
                error: 'Tài khoản hoặc mật khẩu không chính xác!',
            });
            return res.status(401).render('admin/login', DISABLE_LAYOUT_PARTIALS);
        }

        // Compare the input password with the user's password
        if (!compareSync(userInput.password, userFound.password)) {
            sendMessage(req, res, next, {
                error: 'Tài khoản hoặc mật khẩu không chính xác!',
            });
            return res.status(401).render('admin/login', DISABLE_LAYOUT_PARTIALS);
        }

        /***
         * Check if the user's role is admin or moderator set session values and return to view admin
         * Otherwise, return to view login wih error message
         */
        if (
            userFound.role.role_name_en.toLowerCase() === 'admin' ||
            userFound.role.role_name_en.toLowerCase() === 'moderator'
        ) {
            req.session.adminUser = {
                _id: userFound._id,
                userName: userFound.userName,
                fullName: userFound.fullName,
                role_name_en: userFound.role_name_en,
                avatar_url: userFound.avatar,
            };
            return res.redirect(302, '/admin');
        }

        sendMessage(req, res, next, {
            error: 'Tài khoản hoặc mật khẩu không chính xác!',
        });
        return res.status(401).render('admin/login', DISABLE_LAYOUT_PARTIALS);
    }

    // GET /admin/signout
    signout(req, res, next) {
        try {
            if (req.session.adminUser) {
                req.session.adminUser = null;
                req.session.destroy();
                logger.info('Removed admin session');
                return res.redirect('/admin/login');
            } else {
                return res.redirect('/admin/login');
            }
        } catch (error) {
            logger.err('Remove admin session failed: ' + error);
            res.redirect(302, '/admin');
            next();
        }
    }

    //GET /admin/categories
    categories(req, res, next) {
        const ENABLE_LAYOUT_PARTIALS = res.locals.layout;
        res.render('admin/categories/categories', ENABLE_LAYOUT_PARTIALS);
    }
}

module.exports = new AdminController();
