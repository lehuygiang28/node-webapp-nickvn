const express = require('express');
const router = express.Router();

const AdminControllers = require('../app/controllers/AdminController');

router.get('/', AdminControllers.index);

module.exports = router;