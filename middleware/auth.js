/*
 * Summary:     auth middleware user file.
 * Author:      Openxcell(empCode-513)
 */

const UserToken = require("../database/models").tbl_user_token; //include user model
const JWT = require("jsonwebtoken");
const constant = require("../config/constant");
const message = require("../config/web.message");
const status = require("../config/status");
exports.userAuthentication = async (req, res, next) => {
  if (req.headers.authorization) {
    console.log("exports.userAuthentication -> req.headers.authorization", req.headers.authorization)
    try {
      let jwtGetUserDetail = await JWT.verify(
        req.headers.authorization,
        constant.JWT_APP_TOKEN.secret,
        { algorithm: constant.JWT_APP_TOKEN.algo }
      );

      let getUserAuthDetails = await UserToken.findOne({
        where: {
          user_id: jwtGetUserDetail.user_id,
          token: req.headers.authorization,
        },
      });

      if (getUserAuthDetails) {
        req.user_id = getUserAuthDetails.user_id;
        req.token = getUserAuthDetails.token;
        console.log("🚀 ~ file: auth.js ~ line 31 ~ exports.userAuthentication= ~ req.token", req.token)
        console.log("exports.userAuthentication -> req.user_id ", req.user_id )
        next();
      } else {
        res.status(status.status.UNAUTHORIZED_USER).send({
          data: {},
          message: message.INVALIDHEADERS,
          status: status.ERROR,
        });
      }
    } catch (error) {
      console.log("TCL: exports.authenticationApi -> error", error);
      res.status(status.status.UNAUTHORIZED_USER).send({
        data: {},
        message: message.appMessage.TOKENNOTMATCHED,
        status: status.status.ERROR,
      });
    }
  } else {
    res.status(status.status.UNAUTHORIZED_USER).send({
      data: {},
      message: message.appMessage.TOKENREQUIRED,
      status: status.status.ERROR,
    });
  }
};
