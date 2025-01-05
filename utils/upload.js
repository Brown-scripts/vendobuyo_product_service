const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = require('./aws-config');

// Set up Multer storage engine for AWS S3
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'eneye-images', // Replace with your S3 bucket name
    acl: 'public-read', // Set access control (public-read allows public access to the file)
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, `products/${Date.now()}-${file.originalname}`);
    },
  }),
});

module.exports = upload;
