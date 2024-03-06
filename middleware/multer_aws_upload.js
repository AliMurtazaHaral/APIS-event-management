// Used to interact with AWS Service
const AWS = require('aws-sdk');
const fs = require('fs');


AWS.config.update({
	secretAccessKey: process.env.S3_SECRETKEY,
	accessKeyId: process.env.S3_ACCESSKEY,
	region: process.env.S3_REGION,
});

const s3bucket = new AWS.S3({
	params: {
		Bucket: process.env.S3_BUCKET_NAME
	}
});

// To Upload media on S3
function s3Upload(files, path) {
	return new Promise((resolve, reject) => {
		try {
			fs.readFile(files.path, (err, data) => {
				if (err) throw err;
				const params = {
					Bucket: process.env.S3_BUCKET_NAME,
					Key: path,
					Body: files,
					ContentType: files.mimetype,
					Body: data,
					//ACL: 'public-read'
				};
				s3bucket.upload(params, function (err, rese) {
					if (err) {
						throw err;
					}
					console.log("functions3Upload -> rese.Location", rese.Location)
					resolve(rese.Location);

				});
			});
		} catch (e) {
			console.log("functions3Upload -> e", e)
			reject({ message: 'Could not upload image', err: e });
		}
	});
}

module.exports = s3Upload;
