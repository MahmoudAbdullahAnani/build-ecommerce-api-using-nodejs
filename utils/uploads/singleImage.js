const multer = require("multer");

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(
      new apiError(
        "Only JPG and PNG files are allowed " +
          "Please upload a JPG or PNG file",
        400
      )
    );
  }
};
module.exports = {
  storage,
  fileFilter,
};
