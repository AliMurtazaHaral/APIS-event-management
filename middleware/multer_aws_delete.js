// Used to interact with AWS Service

var AWS = require("aws-sdk");
const fs = require("fs");

AWS.config.update({
  secretAccessKey: process.env.S3_SECRETKEY,
  accessKeyId: process.env.S3_ACCESSKEY,
  region: process.env.S3_REGION,
});
var s3 = new AWS.S3({
  params: {
    Bucket: process.env.S3_BUCKET_NAME
  }
});

function s3Delete(path) {

  return s3.deleteObject(
    {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: path
    },
    function (err, data) {
      if (err) {
        console.log("err", err);
      }
      console.log("Successfully deleted image on Amazon S3 ", data);
    }
  );
}

module.exports = s3Delete;
