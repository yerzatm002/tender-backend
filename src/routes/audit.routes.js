const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const rbac = require('../middlewares/rbac.middleware');
const { getLogs } = require('../controllers/audit.controller');

router.get('/logs', auth, rbac(['ADMIN']), getLogs);

module.exports = router;
