const express = require('express');
const router = express.Router();

const UserControllers = require('../app/controllers/UserController');

router.get('/tai-khoan-da-mua', UserControllers.puchased);
router.post('/doi-mat-khau', UserControllers.changePasswordSolvers);
router.get('/doi-mat-khau', UserControllers.changePassword);
router.get('/thong-tin-tai-khoan', UserControllers.index);
router.get('/', UserControllers.index);

module.exports = router;
