const express = require('express');
const router = express.Router();

const lienMinhControllers = require('../app/controllers/LienMinhController');

// dangNhapController.index();

router.get('/acc-lien-minh/:id/buy', lienMinhControllers.buyNowSolvers);
router.get('/acc-lien-minh/:id', lienMinhControllers.showChiTietAccLienMinhCategory);
router.get('/acc-lien-minh', lienMinhControllers.showAccLienMinh);
router.get('/', lienMinhControllers.showLienMinhCategory);

module.exports = router;
