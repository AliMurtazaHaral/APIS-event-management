/*
 * Summary:     admin.controller file for handling all requests and response of ADMIN-PANEL - CMS
 * Author:      Openxcell(empCode-513)
 */

/*Messages,status code and services require*/

const Admin = require("../../database/models").tbl_admin; //import modal always Capital
const AdminToken = require("../../database/models").tbl_admin_token;
const StaticContent = require("../../database/models").tbl_static_content;
const Bcryptjs = require("bcryptjs"); /* For encryption and decryption */
const generatedSalt = Bcryptjs.genSaltSync(10);
const constant = require("../../config/constant");
const JWT_TOKEN = require("jsonwebtoken");
const Mail = require('../../helper/sendmail');
const generateOtp = require("../../helper/general.helper").generateOtp;
const imageUpload = require("../../middleware/multer_aws_upload");
const imageDelete = require("../../middleware/multer_aws_delete");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
module.exports = {
    /* Sign-in*/

    async signIn(req) {
        let find_admin = await Admin.findOne({ where: { email: req.body.email }, attributes: { exclude: ["is_active", "is_deleted", "createdAt", "otp"] } });

        if (find_admin) {
            if (!Bcryptjs.compareSync(req.body.password, find_admin.password)) { // check password
                return 1; //password not valid
            }

            // generate JWT token with email and admin id
            var jwt_string = JWT_TOKEN.sign(
                {
                    email: find_admin.dataValues.email, admin_id: find_admin.dataValues.admin_id
                },
                constant.JWT_TOKEN.secret,
                {
                    expiresIn: constant.JWT_TOKEN.expiresIn,
                    algorithm: constant.JWT_TOKEN.algo
                }
            ); // default: HS256 encryption
            await AdminToken.create({ access_token: jwt_string, admin_id: find_admin.admin_id });
            find_admin.dataValues.profile_photo = find_admin.dataValues.profile_photo ? constant.AWS_S3_URL + constant.AWS_S3_PROJECT_FOLDER +
                constant.AWS_S3_ADMIN_FOLDER + find_admin.profile_photo : null;

            find_admin.dataValues.token = jwt_string;
            delete find_admin.dataValues.password
            return find_admin;
        }
        return 0;
    },
    async signOut(req) {
        let signOut = await AdminToken.destroy({
            where: {
                access_token: req.headers.authorization,
            },
        });
        return signOut;
    },
    async forgotPassword(req, res) {
        let find_email = await Admin.findOne({ where: { email: req.body.email } });
        if (find_email) {
            let get_otp = generateOtp();
            await Admin.update({ otp: get_otp }, { where: { admin_id: find_email.admin_id } })
            var subject = 'Reset password';
            var mailbody = '<div><p>Hello ' +
                req.body.email +
                ' <br/> OTP ' +
                '<b>' +
                get_otp +
                '</b>' +
                ' , </p><p>Use the OTP code to reset your password.</p>' +
                '<p>Ignore this if you did not request to  reset password</p><p>' +
                process.env.APPNAME
                + '</p></div>';
            await Mail.sendmail(res, req.body.email, subject, mailbody);
            // find_email.dataValues.otp = get_otp
            return get_otp
        }
        return 0;
    },
    async resetPassword(req) {
        let encrypted_password = await Bcryptjs.hash(
            req.body.password,
            generatedSalt
        );
        return await Admin.update(
            {
                password: encrypted_password
            },
            {
                where: {
                    email: req.body.email
                }
            }
        );
    },
    async updateProfile(req) {

        let find_admin = await Admin.findOne({
            where: {
                admin_id: req.authId
            }
        });
        if (find_admin) {
            if (req.file) {
                if (find_admin.dataValues.profile_photo) {
                    //delete old image
                    await imageDelete(
                        constant.AWS_S3_PROJECT_FOLDER +
                        constant.AWS_S3_ADMIN_FOLDER +
                        find_admin.dataValues.profile_photo
                    );
                }
                //upload new image
                await Admin.update(
                    {
                        profile_photo: find_admin.admin_id + "_" + req.file.originalname
                    },
                    {
                        where: {
                            admin_id: find_admin.admin_id
                        }
                    }
                );
                await imageUpload(
                    req.file,
                    constant.AWS_S3_PROJECT_FOLDER +
                    constant.AWS_S3_ADMIN_FOLDER +
                    find_admin.admin_id +
                    "_" +
                    req.file.originalname
                );
            }
            let update_admin = {
                name: req.body.name && req.body.name,
            }
            await Admin.update(
                update_admin,
                {
                    where: {
                        admin_id: req.authId
                    }
                }
            );
            let update_admin_res = await Admin.findOne({ where: { admin_id: req.authId }, attributes: ["profile_photo", "name"] })
            update_admin_res.dataValues.profile_photo = constant.AWS_S3_URL + constant.AWS_S3_PROJECT_FOLDER +
                constant.AWS_S3_ADMIN_FOLDER + update_admin_res.profile_photo
            return update_admin_res
        }
        return 0
    },
    async changePassword(req, res) {
        let admin_find = await Admin.findOne({
            where: {
                admin_id: req.authId
            }
        });
        if (admin_find) {
            //decrypt and compare password in database
            let result = Bcryptjs.compareSync(req.body.old_password, admin_find.password);
            if (result) {
                //if it is true then take new password decrypt and update in DB
                let new_password = await Bcryptjs.hash(
                    req.body.new_password,
                    generatedSalt
                );
                return await Admin.update(
                    {
                        password: new_password
                    },
                    {
                        where: {
                            admin_id: admin_find.admin_id
                        }
                    }
                );
            }
        }
    },
    async addStaticPage(req) {
        let static_page_version_obj = {
            title: req.body.title,
            content: req.body.content,
            type: req.body.type
        }
        let add_static_content = await StaticContent.create(static_page_version_obj);
        return add_static_content
    },
    async editStaticPage(req) {
        let static_page_version_obj = {
            title: req.body.title && req.body.title,
            content: req.body.content && req.body.content,
            type: req.body.type && req.body.type
        }
        let add_static_content = await StaticContent.update(static_page_version_obj, { where: { static_content_id: req.params.id } });
        return add_static_content
    },
    async listStaticPage(req, res) {

        const offset = (req.body.page - 1) * constant.LIMIT;
        const limit = constant.LIMIT;
        let order = req.body.order === undefined ? "ASC" : req.body.order;
        let sortBy = req.body.sortBy === undefined ? "createdAt" : req.body.sortBy;
        let search = req.body.search === undefined ? "" : req.body.search;

        let find_static_content = await StaticContent.findAndCountAll({
            where: { title: { [Op.like]: `%${search}%` } },
            offset: offset,
            limit: limit,
            order: [[Sequelize.literal(`${sortBy}`), `${order}`]]
        });
        return find_static_content
    },
    async changeStatusStaticPage(req, res) {
        let add_static_content = await StaticContent.update({ is_active: req.body.is_active }, { where: { static_content_id: req.body.id } });
        return 1
    }
}