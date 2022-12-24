const express = require('express');
const router = express.Router();

const lienMinhControllers = require('../app/controllers/LienMinhController');

// dangNhapController.index();

router.get('/acc-lien-minh', lienMinhControllers.showAccLienMinh)
router.get('/', lienMinhControllers.showLienMinhCategory)

module.exports = router;
