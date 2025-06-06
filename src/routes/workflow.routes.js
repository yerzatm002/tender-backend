const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const {
  getWorkflow,
  approveStep,
  rejectProposal
} = require('../controllers/workflow.controller');

router.use(auth);

router.get('/:proposalId', getWorkflow);
router.post('/:proposalId/approve', approveStep);
router.post('/:proposalId/reject', rejectProposal);

module.exports = router;
