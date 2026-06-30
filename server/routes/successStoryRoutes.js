const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authMiddleware = require('../middleware/auth');
const {
  submitStory, getMyStories, updateMyStory,
  getApprovedStories, getPublicStory,
} = require('../controllers/successStoryController');

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'story-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    cb(null, ext && mime);
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Public routes (no auth)
router.get('/stories', getApprovedStories);
router.get('/stories/:id', getPublicStory);

// Authenticated user routes
router.post('/stories', authMiddleware, upload.fields([
  { name: 'couplePhoto', maxCount: 1 },
  { name: 'weddingGallery', maxCount: 10 },
]), submitStory);

router.get('/my-stories', authMiddleware, getMyStories);

router.put('/stories/:id', authMiddleware, upload.fields([
  { name: 'couplePhoto', maxCount: 1 },
  { name: 'weddingGallery', maxCount: 10 },
]), updateMyStory);

module.exports = router;
