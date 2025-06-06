const express = require('express');
const multer = require('multer');
const path = require('path');
const rbac = require('../middlewares/rbac.middleware');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const {
  upload, getUserDocuments, delete: remove,
  getDocumentById, getDocumentsByTender, getAllDocuments
} = require('../controllers/document.controller');

const storage = multer.diskStorage({
  destination: './src/uploads',
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${file.originalname}`;
    cb(null, unique);
  }
});

const uploadMiddleware = multer({ storage });

router.use(auth);
router.post('/upload', uploadMiddleware.single('file'), upload);
router.get('/', getUserDocuments);
router.get('/all', auth, rbac(['ADMIN', 'MODERATOR']), getAllDocuments);
router.get('/:id', getDocumentById);
router.get('/tender/:tenderId', getDocumentsByTender);
router.delete('/:id', remove);

module.exports = router;
