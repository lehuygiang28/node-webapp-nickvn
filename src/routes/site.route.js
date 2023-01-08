const express = require('express');
const router = express.Router();

const siteControllers = require('../app/controllers/SiteController');

// dangNhapController.index();

router.get('/dang-xuat', siteControllers.signout);
router.post('/dang-nhap', siteControllers.loginSolvers);
router.get('/dang-nhap', siteControllers.login);
router.post('/dang-ky', siteControllers.signupSolvers);
router.get('/dang-ky', siteControllers.signup);
router.get('/', siteControllers.home);

module.exports = router;
