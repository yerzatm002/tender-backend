const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const rbac = require('../middlewares/rbac.middleware');
const {
  getAllProposals, getProposalById, createProposal,
  updateStatus, deleteProposal
} = require('../controllers/proposal.controller');

router.get('/', getAllProposals);
router.get('/:id', getProposalById);

router.use(auth);
router.post('/', rbac(['SUPPLIER']), createProposal);
router.patch('/:id/status', rbac(['CUSTOMER']), updateStatus);
router.delete('/:id', rbac(['SUPPLIER']), deleteProposal);

module.exports = router;
