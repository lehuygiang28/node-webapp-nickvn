const Category = require('../models/Category');
const User = require('../models/User');
const LienMinh = require('../models/LienMinh');
const UserPuchased = require('../models/UserPuchased');
const { mongooseToObject, mutipleMongooseToObject } = require('../../util/mongoose');
const { sendMessage } = require('../../util/flash-message');
const { sendMail, sendMailCallback } = require('../../util/send_mail-nodemailer');
const { logger } = require('../../util/logger');
const { resetProductAndUserPuchased, generateLienMinh } = require('../../util/project_extensions');
const { chiaLayPhanNguyen, chiaLayPhanDu } = require('../../util/caculator');
const sanitize = require('mongo-sanitize');

class LienMinhController {
    // GET /lien-minh
    showLienMinhCategory(_req, res, next) {
        // generateLienMinh(30, next);
        // resetProductAndUserPuchased();

        // Get all the categories with keywords 'lien-minh'
        Category.findOne({ slug: _req.originalUrl.split('/').slice(1).join('/'), visible: 'show' })
            .then((category) => {
                let categoryArr = category.categories.filter((c) => c.visible === 'show');
                res.render('lien-minh/lien-minh', {
                    category: mutipleMongooseToObject(categoryArr),
                });
            })
            .catch(next);
    }

    // GET /lien-minh/acc-lien-minh
    // GET /lien-minh/acc-lien-minh?_paginate&page=:page
    async showAccLienMinh(_req, res, next) {
        let filter = { status_id: 1005, visible: 'show' };
        let optionsQuery = {};
        let pagination = { page: 1, pageCount: 1 };
        let lienMinhQuery;

        // logger.debug(res.locals._sort);

        await sortAndSearch(res);
        await paginationFn(res);

        async function sortAndSearch(res) {
            if (!_req.query.hasOwnProperty('_sort')) {
                return;
            }

            // Search with product id
            if (_req.query.product_id) {
                let productFound = await LienMinh.findOne({
                    product_id: sanitize(_req.query.product_id),
                });

                if (productFound) {
                    return res.redirect(`/lien-minh/acc-lien-minh/${acc.product_id}`);
                }

                sendMessage(_req, res, next, {
                    error: `Không tìm thấy tài khoản số #${_req.query.product_id}`,
                });
                return res.render(`lien-minh/acc-lien-minh`, {
                    pagination: paginationFn,
                });
            }

            // Search with keywords => add keywords to filter
            if (res.locals._sort.search_key) {
                let search_key = sanitize(res.locals._sort.search_key).toString();
                Object.assign(filter, {
                    $or: [
                        { rank: { $regex: search_key, $options: 'i' } },
                        { status_account: { $regex: search_key, $options: 'i' } },
                        { note: { $regex: search_key, $options: 'i' } },
                    ],
                });
            }

            // Search with price => add min, max price to filter
            if (res.locals._sort.min && res.locals._sort.max) {
                Object.assign(filter, {
                    price: {
                        $gte: sanitize(res.locals._sort.min),
                        $lte: sanitize(res.locals._sort.max),
                    },
                });
            }

            // Sort by price [ascc, desc] => add this to filter
            if (res.locals._sort.sort_price) {
                // optionsQuery.sort = { price: res.locals._sort.sort_price };
                Object.assign(optionsQuery, {
                    sort: { price: sanitize(res.locals._sort.sort_price) },
                });
            }
        }

        async function paginationFn(res) {
            // Get data for pagination
            let page = res.locals._pagination.page; // page to get
            let perPage = res.locals._pagination.per_page; // page size
            let skip =
                res.locals._pagination.per_page * res.locals._pagination.page -
                res.locals._pagination.per_page;
            let totalPages;
            let totalDocuments;
            let countDocuments = await LienMinh.countDocuments(filter);

            if (!countDocuments) {
                return res.render('lien-minh/acc-lien-minh');
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
                return res.redirect(`/lien-minh/acc-lien-minh?page=${page}`);
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

        // Get all accounts lien-minh in the database
        lienMinhQuery = LienMinh.find(filter, {}, optionsQuery);
        await lienMinhQuery
            .then((lienminhs) => {
                return res.render('lien-minh/acc-lien-minh', {
                    lienminhs: mutipleMongooseToObject(lienminhs),
                    pagination: pagination,
                });
            })
            .catch(next);
    }

    // Get lien-minh/acc-lien-minh/:id
    showChiTietAccLienMinhCategory(_req, res, next) {
        if (!res.locals.id) {
            return res.redirect(303, '/lien-minh/acc-lien-minh');
        }

        let filter = { product_id: res.locals.id, status_id: 1005, visible: 'show' };
        // Find product by product_id, if exists return product to view, otherwise return error msg
        LienMinh.findOne(filter)
            .then((acc) => {
                if (!acc) {
                    // sendMessage(_req, res, next, { error: true, message: 'Can not find product!' });
                    return res.redirect(303, '/lien-minh/acc-lien-minh');
                } else {
                    // Find 4 products related to product
                    LienMinh.find({
                        status_id: acc.status_id,
                        rank: acc.rank,
                        note: { $regex: '.*' + acc.note + '.*' },
                    })
                        .limit(4)
                        .then((accRelated) => {
                            return res.render('lien-minh/chi-tiet-acc-lien-minh', {
                                acc: mongooseToObject(acc),
                                accRelated: mutipleMongooseToObject(accRelated),
                            });
                        });
                }
            })
            .catch(next);
    }

    // Get lien-minh/acc-lien-minh/:id/buy
    async buyNowSolvers(_req, res, next) {
        // Check session if not login, otherwise...
        if (!_req.session.User) {
            sendMessage(_req, res, next, { error: 'Bạn phải đăng nhập trước khi mua' });
            return res.redirect(303, '/lien-minh/acc-lien-minh');
        }

        try {
            let lienMinhFound;
            let userFound;
            let puchasedFound;

            // Find the product by product id
            lienMinhFound = await LienMinh.findOne({ product_id: _req.params.id, visible: 'show' });
            // If not exists or product is SOLD
            if (!lienMinhFound || lienMinhFound.status_id === 1006) {
                // Send the error message to views
                sendMessage(_req, res, next, { error: 'Không tìm thấy tài khoản' });
                return res.redirect(303, '/lien-minh/acc-lien-minh');
            }

            userFound = await User.findById(_req.session.User._id);
            if (!userFound) {
                // Send the error message to views
                sendMessage(_req, res, next, { error: 'Bạn phải đăng nhập trước khi mua' });
                return res.redirect(303, '/lien-minh/acc-lien-minh');
            }

            if (lienMinhFound.price > userFound.money) {
                sendMessage(_req, res, next, { error: 'Bạn không có đủ tiền' });
                return res.redirect(302, '/lien-minh/acc-lien-minh');
            }

            puchasedFound = await UserPuchased.findOne({ user_id: userFound._id });
            if (!puchasedFound) {
                puchasedFound = new UserPuchased({
                    user_id: userFound._id,
                    product_puchased: [
                        {
                            product: lienMinhFound,
                            created_at: Date.now(),
                        },
                    ],
                });
            } else {
                puchasedFound.product_puchased.push({
                    product: lienMinhFound,
                    created_at: Date.now(),
                });
            }

            Object.assign(userFound, {
                // Subtraction money of user when buy product
                money: userFound.money - lienMinhFound.price,
                updatedAt: Date.now(),
            });
            Object.assign(lienMinhFound, {
                // Change status of product
                status_id: 1006,
                status_name: 'Đã bán',
            });

            await lienMinhFound.save();
            await userFound.save();
            await puchasedFound.save();

            // Send email to user
            sendMailCallback(
                userFound.email,
                {
                    subject: 'Thông tin tài khoản đã mua tại giang.cf',
                    title: `Thông tin tài khoản đã mua #${lienMinhFound.product_id}`,
                    // context: `Tài khoản: ${acc.userName}<br>Mật khẩu: ${acc.password}`,
                    heading: `Xin chào, bạn đã mua thành công tài khoản ${lienMinhFound.game.name} mã số ${lienMinhFound.product_id}!`,
                    userName: lienMinhFound.userName.toString(),
                    password: lienMinhFound.password.toString(),
                },
                () => {
                    logger.info(`Mail sent successful to: ${userFound.email}`);
                },
            );
            sendMessage(_req, res, next, {
                success:
                    'Mua tài khoản thành công, thông tin tài khoản đã được gửi về email của bạn!',
            });
            return res.redirect(302, '/lien-minh/acc-lien-minh');
        } catch (error) {
            console.log(error);
            logger.error(`Error when saving buy: ${error}`);
            sendMessage(_req, res, next, { error: 'Có lỗi xảy ra vui lòng thử lại!' });
            res.redirect(303, '/lien-minh/acc-lien-minh');
            next();
        }
    }
}

// export default new ;
module.exports = new LienMinhController();
