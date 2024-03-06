/*
 * Summary:     admin.controller file for handling all requests and response of ADMIN-PANEL - CMS
 * Author:      Openxcell(empCode-513)
 */

/*Messages,status code and services require*/
const message = require("../../config/cms.message").cmsMessage;
const status = require("../../config/status").status;
const admin_service = require("../../services/cms/admin.service");

module.exports = {
    /* Sign-in*/

    async signIn(req, res) {
        try {
            let admin_login = await admin_service.signIn(req);
            if (admin_login === 1) {
                return res.status(status.SUCCESS_STATUS).send({
                    data: [],
                    message: message.INCORRECT_PASSWORD,
                    status: status.ERROR,
                });
            }
            if (admin_login === 0) {
                return res.status(status.SUCCESS_STATUS).send({
                    data: [],
                    message: message.EMAILNOT_FOUND,
                    status: status.ERROR,
                });
            }
            return res.status(status.SUCCESS_STATUS).send({
                data: admin_login,
                message: message.LOGINSUCCESS,
                status: status.SUCCESS,
            });
        } catch (error) {
            return res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
                error: error,
                message: message.INTERNALSERVERERROR,
                status: status.ERROR,
            });
        }
    },
    //sign out 
    async signOut(req, res) {
        try {
            await admin_service.signOut(req, res);
            res.status(status.SUCCESS_STATUS).send({
                //response on successful details update
                data: [],
                status: status.SUCCESS,
                message: message.LOGOUTSUCCESS,
            });
        } catch (error) {

            res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
                error: error,
                message: message.INTERNALSERVERERROR,
                status: status.ERROR,
            });
        }

    },
    async forgotPassword(req, res) {
        try {
            let forgot_password_res = await admin_service.forgotPassword(req, res);
            if (forgot_password_res === 0) {
                res.status(status.SUCCESS_STATUS).send({
                    data: [],
                    status: status.ERROR,
                    message: message.EMAILNOT_FOUND,
                });
            }
            res.status(status.SUCCESS_STATUS).send({

                data: forgot_password_res,
                status: status.SUCCESS,
                message: message.EMAILSENTSUCCESSFULLY,
            });
        } catch (error) {

            res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
                error: error,
                message: message.INTERNALSERVERERROR,
                status: status.ERROR,
            });
        }
    },
    async resetPassword(req, res) {
        try {
            await admin_service.resetPassword(req, res);

            res.status(status.SUCCESS_STATUS).send({

                data: [],
                message: message.PASSWORDRESET,
                status: status.SUCCESS
            });
        } catch (error) {

            res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
                //response on internal server error
                data: [],
                message: message.INTERNALSERVERERROR,
                status: status.ERROR
            });
        }
    },
    async updateProfile(req, res) {
        try {
            let edit_admin = await admin_service.updateProfile(req, res);

            //response of update admin
            res.status(status.SUCCESS_STATUS).send({
                data: edit_admin,
                message: message.ADMINUPDATED,
                status: status.SUCCESS
            });
        } catch (error) {


            //response on internal server error
            res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
                data: [],
                message: message.internalServerError,
                status: status.error
            });
        }
    },
    async changePassword(req, res) {
        try {
            let change_password = await admin_service.changePassword(
                req,
                res
            );
            if (change_password) {
                res.status(status.SUCCESS_STATUS).send({
                    //response on successfully change password
                    data: [],
                    message: message.PASSWORDCHANGED,
                    status: status.SUCCESS
                });
            } else {
                //response on old password mis-match
                res.status(status.SUCCESS_STATUS).send({
                    data: [],
                    message: message.INCORRECTOLDPASSWORD,
                    status: status.ERROR
                });
            }
        } catch (error) {
            //response on internal server er
            res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
                data: [],
                message: message.INTERNALSERVERERROR,
                status: status.ERROR
            });
        }
    },
    async addStaticPage(req, res) {
        try {
            let static_content_res = await admin_service.addStaticPage(req);
            res.status(status.SUCCESS_STATUS).send({
                //response on email is not-found
                data: [],
                message: message.STATICPAGEADDED,
                status: status.SUCCESS,
            });
        } catch (error) {
            res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
                error: error,
                message: message.INTERNALSERVERERROR,
                status: status.ERROR,
            });
        }
    },
    async editStaticPage(req, res) {
        try {
            let static_content_res = await admin_service.editStaticPage(req);
            res.status(status.SUCCESS_STATUS).send({
                //response on email is not-found
                data: [],
                message: message.STATICPAGEDUPDATED,
                status: status.SUCCESS,
            });
        } catch (error) {
            res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
                error: error,
                message: message.INTERNALSERVERERROR,
                status: status.ERROR,
            });
        }
    },
    async listStaticPage(req, res) {
        try {
            let list_static_page_res = await admin_service.listStaticPage(req);

            res.status(status.SUCCESS_STATUS).send({

                data: list_static_page_res,
                message: message.STATICPAGELIST,
                status: status.SUCCESS,
            });
        } catch (error) {
            res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
                error: error,
                message: message.INTERNALSERVERERROR,
                status: status.ERROR,
            });
        }
    },
    async changeStatusStaticPage(req, res) {
        try {
            let list_static_page_res = await admin_service.changeStatusStaticPage(req);

            res.status(status.SUCCESS_STATUS).send({
                data: [],
                message: message.STATICPAGEDSTATUS,
                status: status.SUCCESS,
            });
        } catch (error) {
            res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
                error: error,
                message: message.INTERNALSERVERERROR,
                status: status.ERROR,
            });
        }
    }
}