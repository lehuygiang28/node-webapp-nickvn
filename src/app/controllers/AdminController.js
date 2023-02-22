const User = require('../models/User');
const Category = require('../models/Category');
const LienMinh = require('../models/LienMinh');
const { sendMessage } = require('../../util/flash-message');
const { createHash, compare, compareSync } = require('../../util/bcrypt');
const { logger } = require('../../util/logger');
const { mongooseToObject, mutipleMongooseToObject } = require('../../util/mongoose');
const { chiaLayPhanNguyen, chiaLayPhanDu } = require('../../util/caculator');
const DISABLE_LAYOUT_PARTIALS = { layout: 'admin_without_partials' };
const path = require('path');
const {
    createUUID,
    createUUIDWithFileExtension,
    createUUIDFile,
} = require('../../util/generateUUID');
const { removeFile } = require('../../util/files');
const sanitize = require('mongo-sanitize');
const { UploadImage, DeleteImage } = require('../../util/imgur');

class AdminController {
    // Get /admin/
    index(req, res, next) {
        return res.render('admin/sites/index');
    }

    // GET /admin/login
    login(req, res, next) {
        res.render('admin/sites/login', DISABLE_LAYOUT_PARTIALS);
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
            return res.status(401).render('admin/sites/login', DISABLE_LAYOUT_PARTIALS);
        }

        // Find the user in database with username
        let userFound = await User.findOne({ userName: sanitize(userInput.userName) });
        if (!userFound) {
            sendMessage(req, res, next, {
                error: 'Tài khoản hoặc mật khẩu không chính xác!',
            });
            return res.status(401).render('admin/sites/login', DISABLE_LAYOUT_PARTIALS);
        }

        // Compare the input password with the user's password
        if (!compareSync(userInput.password, userFound.password)) {
            sendMessage(req, res, next, {
                error: 'Tài khoản hoặc mật khẩu không chính xác!',
            });
            return res.status(401).render('admin/sites/login', DISABLE_LAYOUT_PARTIALS);
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
        return res.status(401).render('admin/sites/login', DISABLE_LAYOUT_PARTIALS);
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
                page: sanitize(page),
                pageCount: totalPages,
            });
        }

        // Add sorting by updated date
        optionsQuery.sort = { updated_at: -1 };

        Category.find(filter, {}, optionsQuery)
            .then((data) => {
                res.render('admin/categories/cate_menu', {
                    allCategories: mutipleMongooseToObject(data),
                    pagination: pagination,
                });
            })
            .catch(() => {
                sendMessage(req, res, next, { error: 'Has error, try again' });
                next();
            });
    }

    // GET /admin/categories/add
    addCategory(req, res, next) {
        let visibleCase = ['show', 'hide'];
        res.render('admin/categories/add_cate', { visibleCase: visibleCase });
    }

    // POST /admin/categories/add
    async addCategorySolvers(req, res, next) {
        let category_name = req.body.category_name;
        let slug = req.body.slug.toString();
        let visible = req.body.visible;
        let imgurRes;

        if (!category_name || !visible || !slug) {
            sendMessage(req, res, next, { error: 'Image upload failed, try again later.' });
            return res.redirect('/admin/categories/add');
        }

        try {
            let { img } = req.files;
            imgurRes = await UploadImage(img);
        } catch (error) {
            sendMessage(req, res, next, { error: 'Image upload failed, try again later.' });
            return res.redirect('/admin/categories/add');
        }

        // Create a new category
        let categoryInput = new Category({
            category_name: category_name,
            slug: slug.charAt(0) === '/' || slug.charAt(0) === '\\' ? slug : `/${slug}`, // Add a slash to the begin of string slug if not have
            visible: visible,
            imgur: imgurRes,
        });

        // Save the category to database
        Category.insertMany(categoryInput)
            .then(() => {
                return res.render('admin/categories/add_cate', {
                    success: 'Add new category successfully',
                });
            })
            .catch(() => {
                DeleteImage(categoryInput.imgur[0].deletehash);
                next();
            });
    }

    // GET /admin/categories/:id/view
    detailCategory(req, res, next) {
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
                return res.render('admin/categories/details_cate', {
                    category: mongooseToObject(data),
                });
            })
            .catch(() => {
                sendMessage(req, res, next, { error: 'Invalid category id, try again.' });
                return res.redirect('/admin/categories');
            });
    }

    // POST /admin/categories/:id/edit
    async editCategorySolvers(req, res, next) {
        if (!req.body._id) {
            sendMessage(req, res, next, { error: 'Invalid category id, try again.' });
            return res.redirect('/admin/categories');
        }
        let _id = req.body._id;
        let categoryFound = await Category.findById(sanitize(_id));
        if (!categoryFound) {
            sendMessage(req, res, next, { error: 'Invalid category id, try again.' });
            return res.redirect('/admin/categories');
        }

        if (isNaN(req.body.total)) {
            sendMessage(req, res, next, { error: 'Total must be number, try again.' });
            return res.redirect(`/admin/categories/${_id}/view`);
        }

        let category_name = req.body.category_name || categoryFound.category_name;
        let slug = req.body.slug || categoryFound.slug;
        let total = req.body.total || categoryFound.total;
        let visible = req.body.visible || categoryFound.visible;
        let imgurRes;

        let categoryEdited = {
            category_name: category_name,
            slug: slug,
            total: total,
            visible: visible,
            updated_at: Date.now(),
        };

        if (req.files) {
            try {
                let { img } = req.files;
                imgurRes = await UploadImage(img);
                Object.assign(categoryEdited, { imgur: imgurRes });
            } catch (error) {
                console.log(error);
                sendMessage(req, res, next, { error: 'Image upload failed, try again later.' });
                return res.redirect(`/admin/categories/${_id}/view`);
            }
        }

        let oldImage = (await Category.findById(sanitize(_id))).imgur[0].deletehash;
        Category.findByIdAndUpdate(sanitize(_id), categoryEdited)
            .then((data) => {
                if (!data) {
                    sendMessage(req, res, next, {
                        error: 'Edit category failed, try again later!',
                    });
                    return res.redirect(`/admin/categories/${_id}/view`);
                }
                DeleteImage(oldImage);
                sendMessage(req, res, next, { success: 'Edit category successfuly!' });
                return res.redirect(`/admin/categories/${_id}/view`);
            })
            .catch(() => {
                sendMessage(req, res, next, { error: 'Edit category failed, try again later!' });
                return res.redirect(`/admin/categories/${_id}/view`);
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

        let cateUpdated = {
            visible: visible,
            updated_at: Date.now(),
        };

        Category.findByIdAndUpdate(_id, cateUpdated)
            .then(() => {
                return res.json({ success: 'Visible has been changed' });
            })
            .catch((error) => {
                res.json({ error: error.message });
                next();
            });
    }

    // GET /admin/products
    async products(req, res, next) {
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
            let countDocuments = await LienMinh.countDocuments(filter);

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
                return res.redirect(`/admin/products?page=${page}`);
            }

            Object.assign(optionsQuery, {
                skip: skip,
                limit: perPage,
            });

            Object.assign(pagination, {
                page: sanitize(page),
                pageCount: totalPages,
            });
        }

        // Add sorting by updated date
        optionsQuery.sort = { updated_at: -1 };

        LienMinh.find(filter, {}, optionsQuery)
            .then((data) => {
                res.render('admin/products/product_menu', {
                    allProducts: mutipleMongooseToObject(data),
                    pagination: pagination,
                });
            })
            .catch(() => {
                sendMessage(req, res, next, { error: 'Has error, try again' });
                next();
            });
    }

    // GET /admin/products/add
    async addProduct(req, res, next) {
        let category = await Category.find({ slug: 'lien-minh' });
        const rankList = [
            'Chưa Rank',
            'Sắt',
            'Đồng',
            'Bạc',
            'Vàng',
            'Bạch Kim',
            'Kim Cương',
            'Cao Thủ',
            'Đại Cao Thủ',
            'Thách Đấu',
        ];
        return res.render('admin/products/add_product', {
            allCategories: mutipleMongooseToObject(category),
            rankList: rankList,
        });
    }

    // POST /admin/products/add
    async addProductSolvers(req, res, next) {
        let imgurArr = [];

        if (!req.body.userName || !req.body.password || !req.body.rank) {
            sendMessage(req, res, next, { success: 'Field can not be empty' });
            return res.redirect('/admin/products/add');
        }

        if (isNaN(req.body.price) || isNaN(req.body.champ) || isNaN(req.body.skin)) {
            sendMessage(req, res, next, {
                success: 'Data is invalid, price - champ - skin must be number',
            });
            return res.redirect('/admin/products/add');
        }

        let input = new LienMinh({
            userName: sanitize(req.body.userName),
            password: sanitize(req.body.password),
            game: {
                name: sanitize(req.body.gameName) || 'Liên Minh',
            },
            price: req.body.price || 0,
            champ: req.body.champ || 0,
            skin: req.body.skin || 0,
            rank: sanitize(req.body.rank),
            status_account: sanitize(req.body.status_account) || undefined,
            note: sanitize(req.body.note) || 'Note',
            visible: sanitize(req.body.visible) || 'hide',
            created_at: Date.now(),
            updated_at: Date.now(),
        });

        switch (req.body.status) {
            case 'available':
                Object.assign(input, {
                    status: {
                        id: 1005,
                        name_en: 'available',
                        name_vi: 'có sẵn',
                    },
                });
                break;
            case 'sold':
            default:
                Object.assign(input, {
                    status: {
                        id: 1006,
                        name_en: 'sold',
                        name_vi: 'đã bán',
                    },
                });
                break;
        }

        if (req.files) {
            let { img } = req.files;
            switch (Array.isArray(img)) {
                case true:
                    img.map(async (image) => {
                        let responseUpload = await UploadImage(image);
                        imgurArr.push(responseUpload);
                    });
                    break;
                case false:
                default:
                    let responseUpload = await UploadImage(img);
                    imgurArr.push(responseUpload);
                    break;
            }
            Object.assign(input, { imgur: imgurArr });
        }

        input.save();
        sendMessage(req, res, next, { success: 'Add new product successfully!' });
        return res.redirect('/admin/products/add');
    }

    // GET /admin/products/:id/view
    async detailProduct(req, res, next) {
        let productFound = await LienMinh.findById(sanitize(req.params.id));
        if (!productFound) {
            sendMessage(req, res, next, { error: 'Product not found!' });
            return res.redirect('/admin/products/product_menu');
        }

        res.render('admin/products/details_product', {
            product: mongooseToObject(productFound),
        });
    }

    // POST /admin/products/:id/edit
    async editProductSolvers(req, res, next) {
        let imgurArr = [];
        let _id = req.params.id;
        let input = {
            game: {
                name: sanitize(req.body.gameName) || undefined,
            },
            price: Number(sanitize(req.body.price)) || undefined,
            skin: Number(sanitize(req.body.skin)) || undefined,
            champ: Number(sanitize(req.body.champ)) || undefined,
            visible: sanitize(req.body.visible) || undefined,
        };

        if (!_id) {
            return res.redirect('/admin/products');
        }

        let oldProduct = await LienMinh.findById(sanitize(_id));
        if (!oldProduct) {
            return res.redirect('/admin/products');
        }

        if (req.files) {
            let { img } = req.files;
            switch (Array.isArray(img)) {
                case true:
                    img.map(async (image) => {
                        let responseUpload = await UploadImage(image);
                        imgurArr.push(responseUpload);
                    });
                    break;
                case false:
                default:
                    let responseUpload = await UploadImage(img);
                    imgurArr.push(responseUpload);
                    break;
            }
            Object.assign(input, { imgur: imgurArr, updated_at: Date.now() });
        }

        Object.assign(oldProduct, input);
        oldProduct
            .save()
            .then(() => {
                sendMessage(req, res, next, { success: 'Edit product successfully' });
                res.redirect(`/admin/products/${oldProduct._id}/view`);
            })
            .catch((err) => next(err));
    }

    // GET /admin/users
    async users(req, res, next) {
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
            let countDocuments = await User.countDocuments(filter);

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
                return res.redirect(`/admin/users?page=${page}`);
            }

            Object.assign(optionsQuery, {
                skip: skip,
                limit: perPage,
            });

            Object.assign(pagination, {
                page: sanitize(page),
                pageCount: totalPages,
            });
        }
        
        let allUsers = await User.find(filter, {}, optionsQuery);
        res.render('admin/users/user_menu', {
            allUsers: mutipleMongooseToObject(allUsers),
            pagination: pagination,
        });
    }

    test(req, res, next) {
        let resa = DeleteImage('YAuFWcmuKrMINiV');
        return res.json(resa);
    }
}

module.exports = new AdminController();
