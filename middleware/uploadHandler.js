const multer = require("multer");
const path = require("path");
const fs = require("fs-extra");
//---------set upload file name and dynamic destination --
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (req.originalUrl == "/upload/") {
      const dir = `./uploads/`;
      try {
        fs.ensureDirSync(dir);
      } catch (err) {
        console.error(err);
      }
      cb(null, dir);
    }
  },
  filename: function (req, file, cb) {
    if (req.originalUrl == "/admin/seller") {
      const { messageId } = req.body;

      cb(
        null,
        new Date()
          .toISOString()
          .replace(/[+~!`:./ \=@#$%^&*(){}<>,?"']/g, "-") + file.originalname
      );
    } else {
      cb(null, "Error");
    }
  },
});

// -------set custom filter for storing file -------------
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const limits = { fileSize: 1024 * 1024 * 5 };

const upload = multer({
  storage,
  limits,
  fileFilter,
});

module.exports.upload = upload;
