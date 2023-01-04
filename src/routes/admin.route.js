const express = require('express');
const router = express.Router();

const AdminControllers = require('../app/controllers/AdminController');

router.get('/signout', AdminControllers.signout);
router.post('/login', AdminControllers.loginSolvers);
router.get('/login', AdminControllers.login);
router.get('/', AdminControllers.index);

module.exports = router;