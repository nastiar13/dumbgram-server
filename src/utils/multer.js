const multer = require('multer');
const path = require('path');

module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let extension = path.extname(file.originalname);
    if (
      extension.toLowerCase() !== '.jpg' &&
      extension.toLowerCase() !== '.jpeg' &&
      extension.toLowerCase() !== '.mp4' &&
      extension.toLowerCase() !== '.mkv' &&
      extension.toLowerCase() !== '.png'
    ) {
      cb(new Error('File type is not supported'), false);
      return;
    }
    cb(null, true);
  },
});
