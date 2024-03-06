const ejs = require("ejs");
const nodemailer = require("nodemailer");
const constant = require("../config/constant");
const message = require("../config/cms.message").cmsMessage;
const status = require("../config/status").status;
var sendmail = async function (
  res,
  email,
  subject,
  mailbody,
  attachments = ""
) {
  try {
    var transporter = nodemailer.createTransport({
      service: constant.MAIL_SERVICE,
      host: constant.MAIL_HOST,
      port: constant.MAIL_PORT,

      secureConnection: false,
      auth: {
        user: constant.MAIL_FROM,
        pass: constant.MAIL_PASSWORD,
      },
      tls: {
        ciphers: 'SSLv3'
      }
    });
    let html_data = await ejs.renderFile(__dirname + "/email.ejs", {
      TITLE: subject,
      HTML_BODY: mailbody,
      LOGOURL: process.env.LOGOURL,
      APPNAME: process.env.APPNAME,
      APPCOLOR: process.env.APPCOLOR,
    });

    let mailoption = {
      from: '"My event advisor" <info@myeventadvisor.com>',
      to: email,
      html: html_data,
      subject: subject,
    };

    if (attachments != "") {
      mailoption.attachments = attachments;
    }
    let mailresponse = await transporter.sendMail(mailoption);

    return mailresponse;
  } catch (error) {
    console.log("error-------", error);

    return res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
      error: error,
      message: message.INTERNALSERVERERROR,
      status: status.ERROR,
    });
  }
};
exports.sendmail = sendmail;
