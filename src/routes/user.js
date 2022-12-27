const express = require('express');
const router = express.Router();

const UserControllers = require('../app/controllers/UserController');

router.get('/change-password', UserControllers.changePassword);
router.get('/puchased', UserControllers.puchased);
router.get('/profile', UserControllers.index);
router.get('/', UserControllers.index);

module.exports = router;
