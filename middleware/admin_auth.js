/*
 * Summary:     admin_auth middleware  file for CMS .
 * Author:      Openxcell(empCode-513) 
 * 
 * note: change model or query according to your requirements
 */


/* NPM-modules,Messages,status code and model require for authentication */
const admin_token = require("../database/models").tbl_admin_token;
const message = require("../config/cms.message").cmsMessage;
const status = require("../config/status").status;
const jwt_token = require("jsonwebtoken");
const constant = require("../config/constant").JWT_TOKEN;

/*Verify Token*/

module.exports = {
    /* Authentication middleware */

    async authentication(req, res, next) {

        try {

            let token = req.headers.authorization; // header token
            if (token) {

                // JWT token verify 
                jwt_token.verify(
                    token,
                    constant.secret,
                    {
                        // expiresIn: ConstantVal.JWTOBJCMS.expiresIn,
                        algorithm: constant.algo
                    },
                    function (err, result) {
                        err
                            ? res.status(status.UNAUTHORIZED_USER).send({
                                message: message.INVALIDHEADERS,
                                status: status.ERROR
                            })
                            : admin_token
                                .findOne({
                                    where: {
                                        access_token: token,
                                        admin_id: result.admin_id
                                    }
                                })
                                .then(token_found => {
                                    if (token_found) {
                                        req.token_found = token_found;
                                        req.authId = result.admin_id;
                                        next();
                                    } else {
                                        // Handle error if token is wrong
                                        res.status(status.UNAUTHORIZED_USER).send({
                                            data: [],
                                            message: message.INVALIDHEADERS,
                                            status: status.ERROR
                                        });
                                    }
                                })
                                .catch(error => {
                                    console.log("authentication -> error", error)

                                    res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
                                        data: [],
                                        message: message.INTERNALSERVERERROR,
                                        status: status.ERROR
                                    });
                                });
                    }
                );
            } else {
                // Handle error if token is wrong
                console.log("authentication -> error")
                res.status(status.SUCCESS_STATUS).send({
                    data: [],
                    message: message.TOKENREQUIRED,
                    status: status.ERROR
                });
            }
        } catch (error) {
            // Handle error if internal server error
            console.log("authentication -> error")
            res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
                data: [],
                message: message.INTERNALSERVERERROR,
                status: status.ERROR
            });
        }
    }
};
