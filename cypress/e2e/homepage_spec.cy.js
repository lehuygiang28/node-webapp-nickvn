const { resetDatabase } = require('../util/reset_database');

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
        resetDatabase();
        cy.fixture('user').then((user) => {
            this.user = user;
        });
    });

    it('passes home page', () => {
        cy.visit('/');
    });

    //username: test

    it('pass login page', () => {
        cy.visit('/');

        cy.contains('.nav.navbar-nav.c-theme-nav>li>a', 'Đăng nhập').click();
        cy.url().should('include', 'dang-nhap');
    });

    it('pass login form', () => {
        cy.visit('/');

        cy.contains('.nav.navbar-nav.c-theme-nav>li>a', 'Đăng nhập').click();

        cy.get('.login-box-body.box-custom>form>div>input[name="username"]').type('tester');
        cy.get('.login-box-body.box-custom>form>div>input[name="password"]').type('1');
        cy.get('.login-box-body.box-custom>form>div>div>button[type="submit"]').click();

        cy.url().should('contain', '/');
        cy.contains('tester');
        cy.contains('Đăng xuất');
    });

    it('pass to product details page and click buy without money', () => {
        cy.visit('/');

        cy.contains('.nav.navbar-nav.c-theme-nav>li>a', 'Đăng nhập').click();

        cy.get('.login-box-body.box-custom>form>div>input[name="username"]').type(
            this.user.user_without_money.username,
        );
        cy.get('.login-box-body.box-custom>form>div>input[name="password"]').type(
            this.user.user_without_money.password,
        );
        cy.get('.login-box-body.box-custom>form>div>div>button[type="submit"]').click();
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
        cy.contains('Thông tin tài khoản #1');
        cy.contains(
            'Bạn không đủ số dư để mua tài khoản này. Bạn hãy click vào nút nạp thẻ để nạp thêm và mua tài khoản.',
        );
        cy.contains('.nav.nav-justified > li > a', 'Tài khoản').click();
        cy.contains('Chi tiết tài khoản #1');

        cy.contains('.modal-content>form>.modal-footer>a', 'Nạp thẻ cào').click();
        cy.url().should('include', 'nap-the');
    });

    it('pass to product details page and click buy with money', () => {
        cy.visit('/');

        cy.contains('.nav.navbar-nav.c-theme-nav>li>a', 'Đăng nhập').click();

        cy.get('.login-box-body.box-custom>form>div>input[name="username"]').type(
            this.user.user_with_money.username,
        );
        cy.get('.login-box-body.box-custom>form>div>input[name="password"]').type(
            this.user.user_with_money.password,
        );
        cy.get('.login-box-body.box-custom>form>div>div>button[type="submit"]').click();
        cy.contains('div.classWithPad>div>h2>a', 'Liên Minh Huyền Thoại').click({ force: true });

        cy.contains('div.classWithPad > .news_title > a', 'Liên Minh').click({ force: true });

        cy.contains('div.classWithPad > .image > a', 'MS: 1').click();

        cy.contains('Mua ngay').click({ force: true });
        cy.contains('Thông tin tài khoản #1');
        cy.contains('Xác nhận mua ngay');
        cy.contains('.nav.nav-justified > li > a', 'Tài khoản').click();
        cy.contains('Chi tiết tài khoản #1');

        cy.contains('.modal-content>form>.modal-footer>button', 'Đóng').click();

        cy.contains('Mua ngay').click();
        cy.contains('Xác nhận mua ngay');
        cy.contains('Chi tiết tài khoản #1');
        cy.contains('.nav.nav-justified > li > a', 'Thanh toán').click();
        cy.contains('Thông tin tài khoản #1');

        // cy.contains('.modal-content>form>.modal-footer>a', 'Xác nhận mua ngay').click();
        // cy.contains('Mua tài khoản thành công, thông tin tài khoản đã được gửi về email của bạn!');
    });
});
