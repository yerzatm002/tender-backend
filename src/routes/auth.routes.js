const express = require('express');
const router = express.Router();
const {
  register, login, getMe, updateProfile, changePassword, logout
} = require('../controllers/auth.controller');

const auth = require('../middlewares/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', auth, logout);

router.get('/me', auth, getMe);
router.patch('/me', auth, updateProfile);
router.post('/change-password', auth, changePassword);

module.exports = router;
