const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const rbac = require('../middlewares/rbac.middleware');
const {
  getAllUsers, getUserById, updateUserRole, deleteUser
} = require('../controllers/user.controller');

router.use(auth, rbac(['ADMIN', 'CUSTOMER']));

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.patch('/:id/role', updateUserRole);
router.delete('/:id', deleteUser);

module.exports = router;
