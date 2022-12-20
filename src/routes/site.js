const express = require('express');
const router = express.Router();

const siteControllers = require('../app/controllers/SiteController');

// dangNhapController.index();

router.get('/dang-nhap', siteControllers.login)
router.get('/', siteControllers.home)

module.exports = router;
