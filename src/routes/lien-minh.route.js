const express = require('express');
const router = express.Router();
const { validIDnumber } = require('../app/middlewares/validatorMiddleware');

const lienMinhControllers = require('../app/controllers/LienMinhController');

// dangNhapController.index();

router.get('/acc-lien-minh/:id/buy', lienMinhControllers.buyNowSolvers);
router.get('/acc-lien-minh/:id', validIDnumber, lienMinhControllers.showChiTietAccLienMinhCategory);
router.get('/acc-lien-minh', lienMinhControllers.showAccLienMinh);
router.get('/', lienMinhControllers.showLienMinhCategory);

module.exports = router;
