const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const rbac = require('../middlewares/rbac.middleware');
const {
  getAllTenders, getTenderById, createTender, updateTender, deleteTender
} = require('../controllers/tender.controller');

router.get('/', getAllTenders);
router.get('/:id', getTenderById);

// Защищённые
router.use(auth);
router.post('/', rbac(['CUSTOMER']), createTender);
router.patch('/:id', rbac(['CUSTOMER']), updateTender);
router.delete('/:id', rbac(['CUSTOMER']), deleteTender);

module.exports = router;
