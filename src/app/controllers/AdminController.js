const User = require('../models/User');
const Category = require('../models/Category');
const LienMinh = require('../models/LienMinh');
const UserPuchased = require('../models/UserPuchased');
const { sendMessage } = require('../../util/flash-message');
const { createHash, compare, compareSync } = require('../../util/bcrypt');
const { logger } = require('../../util/logger');
const { mongooseToObject, mutipleMongooseToObject } = require('../../util/mongoose');
const { chiaLayPhanNguyen, chiaLayPhanDu } = require('../../util/caculator');
const DISABLE_LAYOUT_PARTIALS = { layout: 'admin_without_partials' };
const {
    createUUID,
    createUUIDWithFileExtension,
    createUUIDFile,
} = require('../../util/generateUUID');
const sanitize = require('mongo-sanitize');
const { UploadImage, DeleteImage } = require('../../util/imgur');
const {
    getOneDayInUTCWithLocal,
    compareDateUTCWithGMT7,
    getThisTimeInUTCwithGMTp7,
    compareMonthUCTWithGMT7,
} = require('../../util/time-resolve');

class AdminController {
    // Get /admin/
    async index(req, res, next) {
        let todaySale;
        let totalSale;
        let dataChart = {};

        todaySale = await getTodaySale();
        totalSale = await getTotalSale();
        Object.assign(dataChart, await resolveDataForChart());

        async function resolveDataForChart() {
            let filter = {};

            let dataReturn = await UserPuchased.find(filter).populate({
                path: 'product_puchased.product',
            });

            // Get data of 8 months ago from the current
            let nowDate = new Date();
            let UTC = getThisTimeInUTCwithGMTp7(nowDate);
            let currentMonth = UTC.getMonth();
            let currentYear = UTC.getFullYear();

            let startMonth = currentMonth - 7;
            let startYear = currentYear;

            if (currentMonth <= 7) {
                startMonth = 12 - (7 - currentMonth);
                startYear--;
            }

            let stringTime = '[';
            let stringPrice = '[';

            for (let i = 0; i < 8; i++) {
                if (startMonth > 12) {
                    startMonth = 1;
                    startYear++;
                }
                stringPrice += `${getTotalSaleOfMonth(dataReturn, startMonth, startYear)}\,`;
                stringTime += `${resolveMonthSlashYear(startMonth, startYear)}\,`;
                startMonth++;
            }
            stringTime += ']';
            stringPrice += ']';

            function resolveMonthSlashYear(month, year) {
                return `\'${month}/${year}\'`;
            }

            return { stringTime, stringPrice };
        }

        async function getTodaySale() {
            let nowDate = new Date(); // local datetime
            let oneDayInUTC = getOneDayInUTCWithLocal(nowDate);
            let filter = {
                'product_puchased.created_at': {
                    $gte: oneDayInUTC.start,
                    $lt: oneDayInUTC.end,
                },
            };

            let dataReturn = await UserPuchased.find(filter).populate({
                path: 'product_puchased.product',
            });

            let price = 0;
            // Get and push all products that match the filter to dataFilter
            let dataFilter = [];
            dataReturn.forEach((data) =>
                data.product_puchased.forEach((i) => {
                    return compareDateUTCWithGMT7(nowDate, i.created_at)
                        ? dataFilter.push(i)
                        : undefined;
                }),
            );

            // Add all price of the products
            dataFilter.forEach((data) => {
                data.product.forEach((dataIn) => {
                    price += dataIn.price;
                });
            });

            return price;
        }

        async function getTotalSale() {
            let filter = {};

            let dataReturn = await UserPuchased.find(filter).populate({
                path: 'product_puchased.product',
            });

            let price = 0;
            dataReturn.forEach((data) => {
                data.product_puchased.forEach((dataIn) => {
                    dataIn.product.forEach((dataIn2) => {
                        price += dataIn2.price;
                    });
                });
            });

            return price;
        }

        function getTotalSaleOfMonth(dataInput, month, year) {
            let price = 0;
            // Get and push all products that match the filter to dataFilter
            let dataFilter = [];
            dataInput.forEach((data) =>
                data.product_puchased.forEach((i) => {
                    return month === i.created_at.getMonth() && year === i.created_at.getFullYear()
                        ? dataFilter.push(i)
                        : undefined;
                }),
            );

            // Add all price of the products
            dataFilter.forEach((data) => {
                data.product.forEach((dataIn) => {
                    price += dataIn.price;
                });
            });
            return price;
        }

        return res.render('admin/sites/index', {
            todaySale: todaySale,
            totalSale: totalSale,
            dataChart: dataChart,
        });
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
            return res.status(401).render(
                'admin/sites/login',
                Object.assign(DISABLE_LAYOUT_PARTIALS, {
                    error: 'User Name or Password is incorrect',
                }),
            );
        }

        let filter = {
            userName: sanitize(userInput.userName),
            $or: [
                { 'role.role_name_en': { $regex: /^admin$/i } },
                { 'role.role_name_en': { $regex: /^moderator$/i } },
            ],
        };

        // Find the user in database with username
        let userFound = await User.findOne(filter);
        if (!userFound) {
            return res.status(401).render(
                'admin/sites/login',
                Object.assign(DISABLE_LAYOUT_PARTIALS, {
                    error: 'User Name or Password is incorrect',
                }),
            );
        }

        // Compare the input password with the user's password
        if (!compareSync(userInput.password, userFound.password)) {
            return res.status(401).render(
                'admin/sites/login',
                Object.assign(DISABLE_LAYOUT_PARTIALS, {
                    error: 'User Name or Password is incorrect',
                }),
            );
        }

        if (userFound.status === 'ban') {
            return res.status(401).render(
                'admin/sites/login',
                Object.assign(DISABLE_LAYOUT_PARTIALS, {
                    error: 'Your account has been banned, please contact the administrator(admin@giang.cf) for more information!',
                }),
            );
        }

        req.session.adminUser = {
            _id: userFound._id,
            userName: userFound.userName,
            fullName: userFound.fullName,
            role_name_en: userFound.role_name_en,
            avatar_url: userFound.avatar,
        };

        return res.redirect(302, '/admin');
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

    // GET /admin/users/:username/view
    async detailUser(req, res, next) {
        let userFound = await User.findOne({ userName: sanitize(req.params.username) });
        if (!userFound) {
            return res.redirect('/admin/users');
        }

        res.render('admin/users/detail_user', { user: mongooseToObject(userFound) });
    }

    async orders(req, res, next) {
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
            let countDocuments = await UserPuchased.countDocuments(filter);

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
                return res.redirect(`/admin/orders?page=${page}`);
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

        let allOrders = await UserPuchased.find(filter, {}, optionsQuery)
            .populate({
                path: 'product_puchased.product',
            })
            .populate({
                path: 'user_id',
            })
            .sort({ 'product_puchased.created_at': '-1' });

        let dataFilter = [];
        allOrders.forEach((data) => {
            let order_id = data._id;
            let userName = data.user_id.userName;
            let user_id = data.user_id._id;
            data.product_puchased.forEach((i) => {
                return i
                    ? dataFilter.push({
                          order_level1_id: order_id,
                          order_level2_id: i._id,
                          user_id: user_id,
                          user_name: userName,
                          product__id: i.product[0]._id,
                          product_id: i.product[0].product_id,
                          price: i.product[0].price,
                          created_at: i.created_at,
                      })
                    : undefined;
            });
        });

        dataFilter.sort(function (a, b) {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b.created_at) - new Date(a.created_at);
        });

        res.render('admin/orders/order_menu', {
            allOrders: dataFilter,
            pagination: pagination,
        });

        // res.json(dataFilter);
    }

    // GET /admin/orders/:id/view
    async detailOrder(req, res, next) {
        let _id = req.params.id;
        let _user_id = req.params.user_id;
        if (!_id || !_user_id) {
            return res.redirect('back');
        }

        let orderFound = await UserPuchased.findOne({ user_id: sanitize(_user_id) })
            .populate({
                path: 'user_id',
            })
            .populate({
                path: 'product_puchased.product',
            });

        if (!orderFound) {
            return res.redirect('back');
        }

        // Get order details
        let dataFilter = {
            _user_id: orderFound.user_id._id,
            _user_name: orderFound.user_id.userName,
        };
        orderFound.product_puchased.forEach((product) => {
            if (product._id.toString() === _id.toString()) {
                console.log(product._id);
                return Object.assign(dataFilter, mongooseToObject(product));
            }
        });

        // Modified product form array to 1 object
        dataFilter.product = dataFilter.product[0];

        res.render('admin/orders/detail_order', { order: dataFilter });
    }

    // GET /admin/test
    async test(req, res, next) {
        res.json();
    }

    // POST /admin/users/change-status
    async changeUserStatus(req, res, next) {
        let userName = req.body.userName;
        let status = req.body.status;
        let statusCase = ['active', 'ban'];

        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        if (!userName || !status || !statusCase.includes(status)) {
            return res.redirect('/admin/users');
        }

        if (userName.toString().toLowerCase() === 'admin') {
            sendMessage(req, res, next, {
                error: `Can not change status of ADMIN. Please contact your administrator.`,
            });
            return res.redirect(`back`);
        }

        if (
            userName.toString().toLowerCase() ===
            req.session.adminUser.userName.toString().toLowerCase()
        ) {
            sendMessage(req, res, next, {
                error: `Can not change status yourself. Please contact your administrator.`,
            });
            return res.redirect(`back`);
        }

        let userFound = await User.findOne({ userName: sanitize(userName) });
        if (!userFound || userFound.status.toLowerCase() === status.toLowerCase()) {
            return res.redirect(`back`);
        }

        userFound.status = status;
        userFound.createdAt = new Date();

        userFound.save().then(() => {
            sendMessage(req, res, next, {
                success: `${capitalizeFirstLetter(status)} "${userName}" successfully!`,
            });
            return res.redirect(`back`);
        });
    }
}

module.exports = new AdminController();
