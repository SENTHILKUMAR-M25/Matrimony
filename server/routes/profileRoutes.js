const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const authMiddleware = require('../middleware/auth');
const {
  createProfile,
  getProfile,
  getProfileById,
  downloadMyBiodata,
  downloadBiodata,
} = require('../controllers/profileController');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer disk storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'horoscopePdf') {
    const allowed = /pdf/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = /application\/pdf/.test(file.mimetype);
    if (ext && mime) return cb(null, true);
    return cb(new Error('Only PDF files are allowed for horoscope'));
  }
  const allowed = /jpeg|jpg|png|webp/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpg, jpeg, png, webp) are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB per file
});

const uploadFields = upload.fields([
  { name: 'profilePhoto', maxCount: 1 },
  { name: 'additionalPhotos', maxCount: 5 },
  { name: 'horoscopePdf', maxCount: 1 },
  { name: 'horoscopeImage', maxCount: 1 },
]);

// Routes (specific paths before /:id)
router.get('/me/biodata', authMiddleware, downloadMyBiodata);
router.post('/create', authMiddleware, uploadFields, createProfile);
router.get('/me', authMiddleware, getProfile);
router.get('/:id/biodata', authMiddleware, downloadBiodata);
router.get('/:id', authMiddleware, getProfileById);

module.exports = router;
