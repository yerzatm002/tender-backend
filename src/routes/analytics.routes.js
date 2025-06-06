const express = require('express');
const router = express.Router();
const {
  getOverview,
  getTopSuppliers,
  getTenderStats
} = require('../controllers/analytics.controller');

router.get('/overview', getOverview);
router.get('/top-suppliers', getTopSuppliers);
router.get('/tender/:id', getTenderStats);

module.exports = router;
