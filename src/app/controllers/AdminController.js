const User = require('../models/User');
const Category = require('../models/Category');
const { sendMessage } = require('../../util/flash-message');
const { createHash, compare, compareSync } = require('../../util/bcrypt');
const { logger } = require('../../util/logger');
const { mongooseToObject, mutipleMongooseToObject } = require('../../util/mongoose');
const { chiaLayPhanNguyen, chiaLayPhanDu } = require('../../util/caculator');
const DISABLE_LAYOUT_PARTIALS = { layout: 'admin_without_partials' };
const ADMIN_LAYOUT = { layout: 'admin' };
const path = require('path');
const {
    createUUID,
    createUUIDWithFileExtension,
    createUUIDFile,
} = require('../../util/generateUUID');
const { removeFile } = require('../../util/files');
const sanitize = require('mongo-sanitize');
const { UploadImage } = require('../../util/imgur');

class AdminController {
    // Get /admin/
    index(req, res, next) {
        const ENABLE_LAYOUT_PARTIALS = res.locals.layout || ADMIN_LAYOUT;
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
        const ENABLE_LAYOUT_PARTIALS = res.locals.layout || ADMIN_LAYOUT;
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

        Category.find(filter, {}, optionsQuery)
            .then((data) => {
                res.render(
                    'admin/categories/cate_menu',
                    Object.assign(ENABLE_LAYOUT_PARTIALS, {
                        allCategories: mutipleMongooseToObject(data),
                        pagination: pagination,
                    }),
                );
            })
            .catch(() => {
                sendMessage(req, res, next, { error: 'Has error, try again' });
                next();
            });
    }

    // GET /admin/categories/add
    addCategory(req, res, next) {
        const ENABLE_LAYOUT_PARTIALS = res.locals.layout || ADMIN_LAYOUT;
        let visibleCase = ['show', 'hide'];
        res.render(
            'admin/categories/add_cate',
            Object.assign({ visibleCase: visibleCase }, ENABLE_LAYOUT_PARTIALS),
        );
    }

    // POST /admin/categories/add
    addCategorySolvers(req, res, next) {
        const ENABLE_LAYOUT_PARTIALS = res.locals.layout || ADMIN_LAYOUT;
        let category_name = req.body.category_name;
        let slug = req.body.slug;
        let visible = req.body.visible;
        let fileName;

        if (!category_name || !visible || !slug) {
            sendMessage(req, res, next, { error: 'Image upload failed, try again later.' });
            return res.redirect('/admin/categories/add');
        }

        try {
            // Get file img
            let { img } = req.files;

            // Create a new file name with UUID
            fileName = createUUIDFile(img.name);

            // Move the img to public location image
            img.mv(path.resolve('./src/public/img') + '/' + fileName);

            // Add prefix to file name
            fileName = `/img/${fileName}`;
        } catch (error) {
            removeFile(fileName);
            sendMessage(req, res, next, { error: 'Image upload failed, try again later.' });
            return res.redirect('/admin/categories/add');
        }

        // Create a new category
        let category = new Category({
            category_name: category_name,
            slug: slug.charAt(0) === '/' || slug.charAt(0) === '\\' ? slug : `/${slug}`, // Add a slash to the begin of string slug if not have
            visible: visible,
            img: fileName,
        });

        // Save the category to database
        Category.insertMany(category)
            .then(() => {
                return res.render(
                    'admin/categories/add_cate',
                    Object.assign(ENABLE_LAYOUT_PARTIALS, {
                        success: 'Add new category successfully',
                    }),
                );
            })
            .catch(() => {
                removeFile(fileName);
                next();
            });
    }

    // GET /admin/categories/:id/view
    detailCategory(req, res, next) {
        const ENABLE_LAYOUT_PARTIALS = res.locals.layout || ADMIN_LAYOUT;c
        let _id = req.params.id;
        if (!_id) {
            sendMessage(req, res, next, { error: 'Invalid category id, try again.' });
            return res.redirect('/admin/categories');
        }

        Category.findById(sanitize(_id))
            .then((data) => {
                if (!data) {
                    sendMessage(req, res, next, { error: 'Invalid category id, try again.' });
                    return res.redirect('/admin/categories');
                }
                return res.render(
                    'admin/categories/details_cate',
                    Object.assign(ENABLE_LAYOUT_PARTIALS, {
                        category: mongooseToObject(data),
                    }),
                );
            })
            .catch(() => {
                sendMessage(req, res, next, { error: 'Invalid category id, try again.' });
                return res.redirect('/admin/categories');
            });
    }

    // GET /admin/categories/:id/edit
    // editCategory(req, res, next) {
    //     return res.redirect(`/admin/categories/${req.params.id}/edit`);
    // }

    // POST /admin/categories/:id/edit
    async editCategorySolvers(req, res, next) {
        if (!req.body._id) {
            sendMessage(req, res, next, { error: 'Invalid category id, try again.' });
            return res.redirect('/admin/categories');
        }
        let _id = req.body._id;
        let categoryFound = await Category.findById(_id);
        if (!categoryFound) {
            sendMessage(req, res, next, { error: 'Invalid category id, try again.' });
            return res.redirect('/admin/categories');
        }

        if (isNaN(req.body.total)) {
            sendMessage(req, res, next, { error: 'Total must be number, try again.' });
            return res.redirect(`/admin/categories/${req.body._id}/view`);
        }

        let category_name = req.body.category_name || categoryFound.category_name;
        let slug = req.body.slug || categoryFound.slug;
        let total = req.body.total || categoryFound.total;
        let visible = req.body.visible || categoryFound.visible;
        let fileName = categoryFound.img;

        if (req.files) {
            try {
                let { img } = req.files;
                fileName = await UploadImage(img);
            } catch (error) {
                console.log(error);
                // removeFile(fileName);
                sendMessage(req, res, next, { error: 'Image upload failed, try again later.' });
                return res.redirect(`/admin/categories/${req.body._id}/view`);
            }
        }

        let categoryEdited = {
            category_name: category_name,
            slug: slug,
            total: total,
            visible: visible,
            img: fileName,
        };

        Category.findByIdAndUpdate(_id, categoryEdited)
            .then((data) => {
                if (!data) {
                    return res.json({ error: 'Invalid category id, try again' });
                }
                return res.json({ success: 'Edit successfuly! Reload page to see change' });
            })
            .catch(() => {
                return res.json({ error: 'Invalid category id, try again' });
            });
    }

    // POST /admin/categories/:id/change-visible
    async changeCateVisible(req, res, next) {
        let _id = req.params.id;
        let visible = req.body.visible;
        let visibleCase = ['show', 'hide'];

        if (!_id) {
            return res.json({ error: 'Not Found Id' });
        }

        if (!visibleCase.includes(visible)) {
            return res.json({ error: 'Invalid visible value' });
        }

        Category.findByIdAndUpdate(_id, { visible: visible })
            .then(() => {
                return res.json({ success: 'Visible has been changed' });
            })
            .catch((error) => {
                res.json({ error: error.message });
                next();
            });
    }
}

module.exports = new AdminController();
