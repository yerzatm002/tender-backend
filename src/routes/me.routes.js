const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const {
  myTenders,
  myProposals,
  myDocuments
} = require('../controllers/me.controller');

router.use(auth);
router.get('/tenders', myTenders);
router.get('/proposals', myProposals);
router.get('/documents', myDocuments);

module.exports = router;
