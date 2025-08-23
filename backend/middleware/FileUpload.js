// fileUpload.js
const path = require("path");
const multer = require("multer");

const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads")); // Separate directory
  },
  filename: function (req, file, cb) {
    if (file) {
      cb(null, new Date().toISOString().replace(/:/g, "-") +  file.originalname);
    } else {
      cb(null, false);
    }
  },
});

const fileUpload = multer({
  storage: fileStorage,
  fileFilter: function (req, file, cb) {
    // Accept specific file types if you want
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      console.log("allowedtypes includes ? ",allowedTypes.includes(file.mimetype));
      console.log("mimetype file uploaded : ",file.mimetype);
      cb(null, true);
    } else {
      cb({ message: "Unsupported file format" }, false);
    }
  },
   // 5 MB limit
});

module.exports = fileUpload;
