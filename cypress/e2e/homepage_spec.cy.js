/**
 * Load from home page to buy product without login
 */
// describe('Home page load to buy without login', () => {
//     it('passes home page', () => {
//         cy.visit('/');
//         cy.contains('Dịch vụ nổi bật');
//         cy.contains('Liên Minh Huyền Thoại');
//     });

//     it('pass to category page', () => {
//         cy.visit('/');

//         cy.contains('Liên Minh Huyền Thoại').click();
//         cy.url().should('include', 'lien-minh');
//     });

//     it('pass to product page', () => {
//         cy.visit('/');

//         cy.contains('Liên Minh Huyền Thoại').click();

//         cy.contains('.classWithPad > .news_title > a', 'Liên Minh').click();
//         cy.url().should('include', 'lien-minh/acc-lien-minh');
//     });

//     it('pass to product details page', () => {
//         cy.visit('/');

//         cy.contains('Liên Minh Huyền Thoại').click();

//         cy.contains('.classWithPad > .news_title > a', 'Liên Minh').click();

//         cy.contains('.classWithPad > .image > a', 'MS: 1').click();
//         cy.url().should('include', 'lien-minh/acc-lien-minh/1');
//         cy.contains('Tài khoản liên minh số #1');
//     });

//     it('pass to product details page click buy', () => {
//         cy.visit('/');

//         cy.contains('Liên Minh Huyền Thoại').click();

//         cy.contains('.classWithPad > .news_title > a', 'Liên Minh').click();

//         cy.contains('.classWithPad > .image > a', 'MS: 1').click();

//         cy.contains('Mua ngay').click();
//         cy.contains('Thông tin tài khoản #1');
//         cy.contains('Bạn phải đăng nhập mới có thể mua tài khoản tự động.');
//         cy.contains('.nav.nav-justified > li > a', 'Tài khoản').click();
//         cy.contains('Chi tiết tài khoản #1');

//         cy.contains('.modal-content>form>.modal-footer>button', 'Đóng').click();

//         cy.contains('Mua ngay').click();
//         cy.contains('Thông tin tài khoản #1');
//         cy.contains('Bạn phải đăng nhập mới có thể mua tài khoản tự động.');
//         cy.contains('.nav.nav-justified > li > a', 'Tài khoản').click();
//         cy.contains('Chi tiết tài khoản #1');

//         cy.contains('.modal-content>form>.modal-footer>a', 'Đăng nhập').click();
//         cy.url().should('include', 'dang-nhap');
//     });
// });

/**
 * Load from home page to buy product with login
 */
describe('Home page load to buy with login', function () {

    before(() => {
        cy.fixture('user').then((user) => {
            this.user = user;

            let userMoney = {};
            let userNoMoney = {};

            Object.assign(userMoney, user.user_with_money);
            userMoney.password_type = undefined;

            Object.assign(userNoMoney, user.user_without_money);
            userNoMoney.password_type = undefined;

            const userInserts = [userMoney, userNoMoney];

            cy.dropCollection('users').then((res) => {
                // cy.log(res);
                cy.createCollection('users');
                cy.insertMany(userInserts, { collection: 'users' }).then((res) => {
                    console.log(res);
                });
            });
        });

        cy.fixture('lienminhs').then(async (product) => {
            await Promise.all([
                cy.dropCollection('lienminhs', { failSilently: true }),
                cy.dropCollection('counters'),
            ]).then(async ([res1, res2]) => {
                //Destructuring the array of responses from the promises into two variables res1 and res2  respectively
                // cy.log(res1); //Logging the response of the first promise i-e dropCollection('lienminhs')
                // cy.log(res2); //Logging the response of the second promise i-e dropCollection('counters')

                await Promise.all([
                    cy.createCollection('counters'),
                    cy.createCollection('lienminhs'),
                ]); //Creating both collections in parallel using Promise all

                let counter = {
                    //Defining counter object to be inserted into counters collection
                    id: 'product_id', //Setting id field to product_id
                    reference_value: null, //Setting reference value to null
                    seq: 1, //Setting seq field to 1
                };

                await Promise.all([
                    cy.insertOne(counter, { collection: 'counters' }),
                    cy.insertOne(product, { collection: 'lienminhs' }),
                ]); //Inserting both counter and product documents in parallel using Promise all
            });
        });
    });

    it('passes home page', () => {
        cy.visit('/');
        cy.contains('Trang chủ');
    });

    it('pass login page', () => {
        cy.visit('/');

        cy.contains('.nav.navbar-nav.c-theme-nav>li>a[href="/dang-nhap"]', 'Đăng nhập').click();
        cy.url().should('include', 'dang-nhap');
    });

    it('pass login form', () => {
        cy.visit('/');

        cy.contains('.nav.navbar-nav.c-theme-nav>li>a[href="/dang-nhap"]', 'Đăng nhập').click();

        cy.get('form[action="/dang-nhap"]').within(() => {
            cy.get('input[name="username"]').type('tester');
            cy.get('input[name="password"]').type('1');
            cy.get('button[type="submit"]').click();
        });

        cy.url().should('contain', '/');
        cy.contains('tester');
        cy.contains('Đăng xuất');
    });

    it('pass to product details page and click buy without money', () => {
        cy.visit('/');

        cy.contains('.nav.navbar-nav.c-theme-nav>li>a[href="/dang-nhap"]', 'Đăng nhập').click();

        cy.get('form[action="/dang-nhap"]').within(() => {
            cy.get('input[name="username"]').type(this.user.user_without_money.userName);
            cy.get('input[name="password"]').type(this.user.user_without_money.password_type);
            cy.get('button[type="submit"]').click();
        });

        cy.contains('.classWithPad>div>h2>a', 'Liên Minh Huyền Thoại').click();

        cy.contains('.classWithPad > .news_title > a', 'Liên Minh').click();

        cy.contains('.classWithPad > .image > a', 'MS: 1').click();

        cy.contains('Mua ngay').click();
        cy.contains('Thông tin tài khoản #1');
        cy.contains(
            'Bạn không đủ số dư để mua tài khoản này. Bạn hãy click vào nút nạp thẻ để nạp thêm và mua tài khoản.',
        );
        cy.contains('.nav.nav-justified > li > a', 'Tài khoản').click();
        cy.contains('Chi tiết tài khoản #1');

        cy.contains('.modal-content>form>.modal-footer>button', 'Đóng').click();

        cy.contains('Mua ngay').click();
        cy.contains('Chi tiết tài khoản #1');
        cy.contains(
            'Bạn không đủ số dư để mua tài khoản này. Bạn hãy click vào nút nạp thẻ để nạp thêm và mua tài khoản.',
        );
        cy.contains('.nav.nav-justified > li > a', 'Thanh toán').click();
        cy.contains('Thông tin tài khoản #1');

        cy.contains('.modal-content>form>.modal-footer>a', 'Nạp thẻ cào').click();
        cy.url().should('include', 'nap-the');
    });

    it('pass to product details page and click buy with money', () => {
        cy.visit('/');

        cy.contains('.nav.navbar-nav.c-theme-nav>li>a[href="/dang-nhap"]', 'Đăng nhập').click();

        cy.get('form[action="/dang-nhap"]').within(() => {
            cy.get('input[name="username"]').type(this.user.user_with_money.userName);
            cy.get('input[name="password"]').type(this.user.user_with_money.password_type);
            cy.get('button[type="submit"]').click();
        });

        cy.contains('.classWithPad>div>h2>a', 'Liên Minh Huyền Thoại').click({ force: true });

        cy.contains('div.classWithPad > .news_title > a', 'Liên Minh').click({ force: true });

        cy.contains('div.classWithPad > .image > a', 'MS: 1').click();

        cy.contains('.c-product-header>.c-content-title-1>button', 'Mua ngay').click({
            force: true,
        });
        cy.contains('Xác nhận mua ngay');
        cy.contains('Chi tiết tài khoản #1');
        cy.contains('.nav.nav-justified > li > a', 'Thanh toán').click();
        cy.contains('Thông tin tài khoản #1');

        cy.contains('.modal-content>form>.modal-footer>button', 'Đóng').click();

        cy.contains('Mua ngay').click();
        cy.contains('Thông tin tài khoản #1');
        cy.contains('Xác nhận mua ngay');
        cy.contains('.nav.nav-justified > li > a', 'Tài khoản').click();
        cy.contains('Chi tiết tài khoản #1');

        cy.wait(5000);
        cy.contains('.modal-content>form>.modal-footer>a', 'Xác nhận mua ngay').click();
        cy.contains('Mua tài khoản thành công, thông tin tài khoản đã được gửi về email của bạn!');

        cy.contains('div.modal-dialog>div.modal-content>div.modal-footer>button', 'Xác nhận').click();
        cy.contains('.nav.navbar-nav.c-theme-nav>li>a[href="/user/thong-tin-tai-khoan"]', 'tester1 - 99.500.000 VND')
    });
});
