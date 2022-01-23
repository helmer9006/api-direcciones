const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + "/../uploads");
  },
  filename: (req, file, cb) => {
    const extension = file.originalname.substring(
      file.originalname.lastIndexOf("."),
      file.originalname.length
    );
    cb(null, `${file.fieldname}-${Date.now()}${extension}`);
  },
});
const upload = multer({ storage });
module.exports = upload;
