const multer = require("multer");

// multer storage cofiguration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// multer upload cofiguration
const upload = multer({ storage: storage }).array("productImages", 5);

module.exports = upload;
