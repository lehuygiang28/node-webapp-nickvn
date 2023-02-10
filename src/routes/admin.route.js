const express = require('express');
const router = express.Router();

const AdminControllers = require('../app/controllers/AdminController');

router.get('/categories/:id/edit', AdminControllers.editCategory);
router.get('/categories/:id/view', AdminControllers.detailCategory);
router.get('/categories/add', AdminControllers.addCategory);
router.get('/categories', AdminControllers.categories)

router.get('/signout', AdminControllers.signout);
router.post('/login', AdminControllers.loginSolvers);
router.get('/login', AdminControllers.login);
router.get('/dashboard', AdminControllers.index);
router.get('/', AdminControllers.index);

module.exports = router;
