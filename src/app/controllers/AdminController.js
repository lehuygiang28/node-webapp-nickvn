const User = require('../models/User');
const Category = require('../models/Category');
const { sendMessage } = require('../../util/flash-message');
const { createHash, compare, compareSync } = require('../../util/bcrypt');
const { logger } = require('../../util/logger');
const { mongooseToObject, mutipleMongooseToObject } = require('../../util/mongoose');
const { chiaLayPhanNguyen, chiaLayPhanDu } = require('../../util/caculator');
const DISABLE_LAYOUT_PARTIALS = { layout: 'admin_without_partials' };

class AdminController {
    // Get /admin/
    index(req, res, next) {
        const ENABLE_LAYOUT_PARTIALS = res.locals.layout;
        return res.render('admin', ENABLE_LAYOUT_PARTIALS);
    }

    // GET /admin/login
    login(req, res, next) {
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
    async categories(req, res, next) {
        const ENABLE_LAYOUT_PARTIALS = res.locals.layout;
        let filter = {};
        let optionsQuery = {};
        let pagination = { page: 1, pageCount: 1 };

        await paginationFn(res);

        async function paginationFn(res, perPage = 20) {
            // Get data for pagination
            let page = res.locals._pagination.page; // page to get
            // let perPage = 6; // page size
            let skip = perPage * res.locals._pagination.page - perPage;
            let totalPages;
            let totalDocuments;
            let countDocuments = await Category.countDocuments(filter);

            if (!countDocuments) {
                return;
            }

            totalDocuments = !countDocuments ? 0 : countDocuments;

            totalPages =
                chiaLayPhanNguyen(totalDocuments, perPage) +
                (chiaLayPhanDu(totalDocuments, perPage) > 0 ? 1 : 0);

            if (totalDocuments === 0) {
                totalPages = 0;
            }

            if (page > totalPages) {
                page = totalPages;
                return res.redirect(`/admin/categories?page=${page}`);
            }

            Object.assign(optionsQuery, {
                skip: skip,
                limit: perPage,
            });

            Object.assign(pagination, {
                page: page,
                pageCount: totalPages,
            });
        }

        Category.find(filter, {}, optionsQuery).then((data) => {
            res.render(
                'admin/categories/cate_menu',
                Object.assign(ENABLE_LAYOUT_PARTIALS, {
                    allCategories: mutipleMongooseToObject(data),
                    pagination: pagination,
                }),
            );
        });
    }

    // GET /admin/categories/add
    addCategory(req, res, next) {
        res.render('admin/categories/add_cate', res.locals.layout);
    }

    // GET /admin/categories/:id/view
    detailCategory(req, res, next) {
        res.render('admin/categories/details_cate', res.locals.layout);
    }

    // GET /admin/categories/:id/edit
    editCategory(req, res, next) {
        res.render('admin/categories/edit_cate', res.locals.layout);
    }

    // GET /admin/categories/:id/change-visible
    async changeCateVisible(req, res, next) {
        let _id = req.params.id;
        let visible = req.body.visible;
        let visibleCase = ['show', 'hide'];

        if (!_id) {
            return res.json({ error: 'Not Found Id' });
        }

        if(!visibleCase.includes(visible)) {
            return res.json({ error: 'Invalid visible value' });
        }

        let cateFound = await Category.findByIdAndUpdate(_id, {visible: visible});
        console.log(cateFound);
        console.log(`Visible choose: ${visible}`);

        return res.json({ success: 'Visible has been changed' });
    }
}

module.exports = new AdminController();
