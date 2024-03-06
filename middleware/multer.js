/*
 * Summary:     Multer is middleware for upload image
 * Author:      Openxcell(empCode-513)
 */
const multer = require("multer");
const path = require("path");
const os = require("os");
const fs = require("fs");
const tmpdir = os.tmpdir();
const randomStringHelper = require("../helper/general.helper");

var storage = multer.diskStorage({
  
  destination: function (req, file, cb) {
    console.log("🚀 ~ file: multer.js ~ line 30 ~ imageName")

    cb(null, tmpdir);
  },
  filename: function (req, file, cb) {
    const imageName =
      randomStringHelper.generateRandomString(5) +
      "_" +
      Date.now() +
      path.extname(file.originalname);

    const filepath = path.join(tmpdir, imageName);
    file.originalname = imageName;
    fs.mkdtemp(filepath, (err, folder) => {
      if (err) throw err;
      cb(null, imageName);
    });
  },
});

exports.singleProfilePic = multer({
  storage: storage,
}).single("image");

exports.multiProfilePic = multer({
  storage: storage,
}).any();
