const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const {
  getReviewsByUser,
  createReview,
  updateReview,
  deleteReview
} = require('../controllers/review.controller');

router.get('/user/:userId', getReviewsByUser);

router.use(auth);
router.post('/', createReview);
router.patch('/:id', updateReview);
router.delete('/:id', deleteReview);

module.exports = router;
