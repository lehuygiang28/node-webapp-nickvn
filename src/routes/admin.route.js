const express = require('express');
const router = express.Router();

const AdminControllers = require('../app/controllers/AdminController');

router.get('/users', AdminControllers.users);

router.post('/products/:id/edit', AdminControllers.editProductSolvers)
router.get('/products/:id/view', AdminControllers.detailProduct);
router.post('/products/add', AdminControllers.addProductSolvers);
router.get('/products/add', AdminControllers.addProduct);
router.get('/products', AdminControllers.products);

router.post('/categories/:id/change-visible', AdminControllers.changeCateVisible);
router.post('/categories/:id/edit', AdminControllers.editCategorySolvers);
router.get('/categories/:id/view', AdminControllers.detailCategory);
router.post('/categories/add', AdminControllers.addCategorySolvers);
router.get('/categories/add', AdminControllers.addCategory);
router.get('/categories', AdminControllers.categories)

router.get('/signout', AdminControllers.signout);
router.post('/login', AdminControllers.loginSolvers);
router.get('/login', AdminControllers.login);
router.get('/dashboard', AdminControllers.index);
router.get('/', AdminControllers.index);

module.exports = router;
