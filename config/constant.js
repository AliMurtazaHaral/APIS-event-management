/** express-mailer configurations */
exports.MAIL_FROM = process.env.MAIL_FROM;
exports.MAIL_FROM_AUTH = process.env.MAIL_FROM_AUTH;
exports.MAIL_PASSWORD = process.env.MAIL_PASSWORD;
exports.MAIL_SERVICE = process.env.MAIL_SERVICE;
exports.MAIL_HOST = process.env.MAIL_HOST;
exports.MAIL_PORT = process.env.MAIL_PORT;
exports.MAIL_METHOD = process.env.MAIL_METHOD;
exports.MAIL_SECURE = true;
exports.AWS_S3_URL = process.env.S3_AWS_URL;
exports.AWS_S3_PROJECT_FOLDER = "event-management/";
exports.AWS_S3_ADMIN_FOLDER = "admin/";
exports.AWS_S3_USER_FOLDER = "user/";
exports.AWS_SERVICE_FOLDER = "service/";
exports.AWS_EVENT_FOLDER = "event/";
exports.API_URL = process.env.API_URL
exports.RESET_PASSWORD_URL = process.env.RESET_PASSWORD_URL
exports.WEB_SITE_URL = process.env.WEB_SITE_URL
exports.LIMIT = 10

exports.CATEGORY_TYPE = {
  EVENT: "EVENT",
  SERVICE: "SERVICE"
};

exports.JWT_TOKEN = {
  algo: "HS256",
  secret: "itstopsecret",
  expiresIn: "24h",
};

exports.JWT_APP_TOKEN = {
  algo: "HS256",
  secret: "itstopsecret",
};

exports.STRIPE_CONFIGS = {
  webHookSecretSign: process.env.STRIPE_WEBHOOK_SIGN
}