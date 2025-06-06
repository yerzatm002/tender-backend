const express = require('express');
const router = express.Router();
const { searchTenders, searchProposals } = require('../controllers/search.controller');

router.get('/tenders', searchTenders);
router.get('/proposals', searchProposals);

module.exports = router;
