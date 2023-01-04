const User = require('../models/User');
const { sendMessage } = require('../../util/flash-message');
const { compare } = require('../../util/bcrypt');
const { logger } = require('../../util/logger');
const { mongooseToObject, mutipleMongooseToObject } = require('../../util/mongoose');
const { request } = require('express');


class AdminController {

    index(req, res, next) {
        if (!req.session.adminUser) {
            return res.redirect('/admin/login');
        }

        

        res.render('admin', res.locals.layout);
    }

    async login(req, res, next) {
        let adminUser;
        let layoutWithoutPartials = { layout: 'admin_without_partials' };
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
                        })
                        return res.redirect('/admin');
                    case 'member':
                        sendMessage(req, res, next, { error: true, message: 'Tài khoản hoặc mật khẩu không chính xác!' });
                        return res.render('admin/login', layoutWithoutPartials);
                }
            }

            sendMessage(req, res, next, { error: true, message: 'Tài khoản hoặc mật khẩu không chính xác!' });
            res.render('admin/login', layoutWithoutPartials);
        }

        res.render('admin/login', layoutWithoutPartials);
    }

    async loginSolvers(req, res, next) {
        let layoutWithoutPartials = { layout: 'admin_without_partials' };
        let userInput = {
            userName: req.body.user_name.toString() || undefined,
            password: req.body.password.toString() || undefined,
        };

        // Check username and password is not empty
        if (userInput.userName == undefined || userInput.password == undefined) {
            sendMessage(req, res, next, { error: true, message: 'Tài khoản hoặc mật khẩu không chính xác!' });
            return res.render('admin/login', layoutWithoutPartials);
        }

        // Find the user in database with username
        let userFound = await User.findOne({ userName: userInput.userName });
        if (!userFound) {
            sendMessage(req, res, next, { error: true, message: 'Tài khoản hoặc mật khẩu không chính xác!' });
            return res.render('admin/login', layoutWithoutPartials);
        }

        // Compare the input password with the user's password
        compare(userInput.password, userFound.password, (err, result) => {
            // If error or password is incorrect, return login view with error message
            if (err) {
                sendMessage(req, res, next, { error: true, message: 'Tài khoản hoặc mật khẩu không chính xác!' });
                return res.render('admin/login', layoutWithoutPartials);
            }
            if (!result) {
                sendMessage(req, res, next, { error: true, message: 'Tài khoản hoặc mật khẩu không chính xác! pw' });
                return res.render('admin/login', layoutWithoutPartials);
            }

            /***
             * Check if the user's role is admin or moderator set session values and return to view admin
             * Otherwise, return to view login wih error message
             */
            if (userFound.role.role_name_en.toLowerCase() === 'admin' || userFound.role.role_name_en.toLowerCase() === 'moderator') {
                req.session.adminUser = {
                    _id: userFound._id,
                    userName: userFound.userName,
                    fullName: userFound.fullName,
                    role_name_en: userFound.role_name_en,
                    avatar_url: userFound.avatar
                }
                return res.redirect('/admin');
            }
        });
        sendMessage(req, res, next, { error: true, message: 'Tài khoản hoặc mật khẩu không chính xác!' });
        return res.render('admin/login', layoutWithoutPartials);
    }

    signout(req, res, next) {
        try {
            if (req.session.adminUser) {
                req.session.adminUser = null;
                logger.info('Removed admin session');
                return res.redirect('/admin/login');
            } else {
                return res.redirect('/admin/login');
            }
        } catch (error) {
            logger.err('Remove admin session failed: ' + error);
            res.redirect('/admin');
            next();
        }
    }

}

module.exports = new AdminController;