const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { detectMime, ALLOWED, EXT_MAP } = require('../utils/magicBytes');

// Store in memory first so we can inspect magic bytes before saving
const memStorage = multer.memoryStorage();

const _multer = multer({
  storage: memStorage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8 MB
  fileFilter: (_req, file, cb) => {
    // Optimistic MIME check — real validation happens after buffer is available
    if (!file.mimetype.startsWith('image/')) {
      return cb(Object.assign(new Error('Tipo de arquivo inválido. Apenas JPEG, PNG e WebP são aceites.'), { code: 'INVALID_FILE_TYPE' }));
    }
    cb(null, true);
  },
});

const UPLOADS_DIR = path.join(__dirname, '../../uploads');

// Garantir que a pasta existe (Railway não persiste o filesystem entre deploys)
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Middleware: multer upload + magic bytes validation + save to disk
function uploadImage(fieldName) {
  return [
    _multer.single(fieldName),
    (req, res, next) => {
      if (!req.file) return next();

      const mime = detectMime(req.file.buffer);
      if (!mime || !ALLOWED.has(mime)) {
        return res.status(400).json({ error: 'Tipo de arquivo inválido. Apenas JPEG, PNG e WebP são aceites.' });
      }

      const filename = `${uuidv4()}${EXT_MAP[mime]}`;
      const dest = path.join(UPLOADS_DIR, filename);

      fs.writeFile(dest, req.file.buffer, err => {
        if (err) return next(err);
        req.file.filename = filename;
        req.file.path = dest;
        req.file.detectedMime = mime;
        next();
      });
    },
  ];
}

module.exports = { uploadImage };
