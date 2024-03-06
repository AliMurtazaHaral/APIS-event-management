/*
 * Summary:     user.services file for handling all PROVIDER and CUSTOMER - CMS related actions.
 * Author:      Openxcell(empCode-496)
 */

/**require NPM-modules,models and constants for configuration */
const User = require("../../database/models").tbl_user;
const Review = require("../../database/models").tbl_review;
const ContactUs = require("../../database/models").tbl_contact_us;

const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const constant = require("../../config/constant");
const Mail = require("../../helper/sendmail");
const imageupload = require("../../middleware/multer_aws_upload");
const imageDelete = require("../../middleware/multer_aws_delete");

module.exports = {
  /* List Provider And customer*/

  async listUser(req, res) {
    let { sort_by, order, search, page } = req.body;
    const offset = (page - 1) * constant.LIMIT;
    const limit = constant.LIMIT;
    let searchObj;
    search = search === undefined ? "" : search;
    searchObj = {
      where: {
        is_deleted: false,
        is_email_verified: true,
        [Op.or]: [
          {
            full_name: {
              [Op.like]: `%${search}%`,
            },
          },
          {
            email: {
              [Op.like]: `%${search}%`,
            },
          },
          {
            phone_number: {
              [Op.like]: `%${search}%`,
            },
          },
        ],
      },
    };
    if (req.body.type === "provider") {
      searchObj.where.type = "provider";
    }
    if (req.body.type === "customer") {
      searchObj.where.type = "customer";
    }
    let list_cat = await User.findAndCountAll({
      where: searchObj.where,
      distinct: true,
      include: [
        {
          model: Review,
          as: "reviews",
          order: [["createdAt", "DESC"]],
          required: false,
          attributes: ["review_id", "review", "rating", "createdAt"],
          include: [
            {
              model: User,
              as: "given_by",
              attributes: ["full_name", "profile_image"],
            },
          ],
        },
      ],
      // subQuery: false,
      order: [[Sequelize.literal(`${sort_by}`), `${order}`]],
      offset: offset,
      limit: limit,
    });
    list_cat.rows.map((result) => {
      if (result.profile_image) {
        result.profile_image =
          constant.AWS_S3_URL +
          constant.AWS_S3_PROJECT_FOLDER +
          constant.AWS_S3_USER_FOLDER +
          result.profile_image;
      }
      if (result.reviews.length > 0) {
        let rating = 0;

        result.reviews.map((data) => {
          data.given_by.profile_image =
            constant.AWS_S3_URL +
            constant.AWS_S3_PROJECT_FOLDER +
            constant.AWS_S3_USER_FOLDER +
            data.given_by.profile_image;
          review = rating += data.rating;
        });
        return (result.dataValues.rating = rating / result.reviews.length);
      }
    });
    return list_cat;
  },

  /* View Provider by ID*/

  async getUserById(req, res) {
    let find_user = await User.findOne({
      where: { user_id: req.params.id },
      attributes: {
        exclude: [
          "is_active",
          "is_email_verifed",
          "is_deleted",
          "createdAt",
          "updatedAt",
        ],
      },
    });

    find_user.dataValues.profile_image =
      constant.AWS_S3_URL +
      constant.AWS_S3_PROJECT_FOLDER +
      constant.AWS_S3_USER_FOLDER +
      find_user.profile_image;

    return find_user;
  },

  /* Update Provider Or customer status*/

  async updateUserStatus(req, res) {
    //is_active = true/false
    let update_status = await User.update(
      { is_active: req.body.is_active },
      { where: { user_id: req.params.id } }
    );

    return update_status;
  },

  /* Update Provider Approval status*/

  async updateUserApprovalStatus(req, res) {
    let { approval_status } = req.body;

    let update_approval_status = await User.update(
      { approval_status },
      { where: { user_id: req.params.id } }
    );

    let find_user = await User.findOne({
      where: { user_id: req.params.id },
    });

    //if provider is rejected then rejected mail response send to provider Email address
    if (req.body.approval_status === "rejected") {
      var subject = "Regarding Approval Request ";
      var mailbody =
        "<div><p>Hello " +
        find_user.full_name +
        " " +
        ",</p><p>Your request for provider on event app is Rejected.</p>" +
        "<p> Kindly contact admin for further procedure. </p>";
      ("Team Event</p></div>");
      await Mail.sendmail(res, find_user.email, subject, mailbody);
      console.log("rejection_mail_send");
    }

    //if provider is approved then approved mail response send to provider Email address
    if (req.body.approval_status === "approved") {
      var subject = "Regarding Approval Request ";
      var mailbody =
        "<div><p>Hello " +
        find_user.full_name +
        ",</p><p>Your request for provider on event app  is approved.</p>" +
        "Team event app  </p></div>";
      await Mail.sendmail(res, find_user.email, subject, mailbody);

      console.log("approved_mail_send");
    }
    return update_approval_status;
  },

  /*  Delete Provider Or customer status  */

  async deleteUser(req, res) {
    // delete particular user from DB (soft-delete)
    let update_user_del_flag = await User.update(
      {
        is_deleted: true,
      },
      {
        where: {
          user_id: req.params.id,
        },
      }
    );
    return update_user_del_flag;
  },

  /*Update Provider and customer*/

  async updateUser(req, res) {
    let { full_name } = req.body;

    if (req.file) {
      let image_result = await User.findOne({
        where: {
          user_id: req.params.id,
        },
      });
      imageDelete(
        constant.AWS_S3_PROJECT_FOLDER +
          constant.AWS_S3_USER_FOLDER +
          image_result.dataValues.profile_image
      );
      let data = await imageupload(
        req.file,
        constant.AWS_S3_PROJECT_FOLDER +
          constant.AWS_S3_USER_FOLDER +
          req.params.id +
          "_" +
          req.file.originalname
      );
      console.log("updateUser -> data", data);
    }
    let update_user = await User.update(
      {
        full_name: full_name,
        profile_image: req.file && req.params.id + "_" + req.file.originalname,
      },
      { where: { user_id: req.params.id } }
    );
    return update_user;
  },

  async listContactUs(req, res) {
    let { sort_by, order, search, page } = req.body;
    const offset = (page - 1) * constant.LIMIT;
    const limit = constant.LIMIT;
    search = search === undefined ? "" : search;

    let list_contact_us = await ContactUs.findAndCountAll({
      where: {
        [Op.or]: [
          {
            subject: {
              [Op.like]: `%${search}%`,
            },
          },
          {
            comment: {
              [Op.like]: `%${search}%`,
            },
          },
        ],
      },
      attributes: { exclude: ["updatedAt"] },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["user_id", "full_name", "profile_image"],
        },
      ],
      order: [[Sequelize.literal(`${sort_by}`), `${order}`]],
      offset: offset,
      limit: limit,
    });
    list_contact_us.rows.map((res) => {
      res.user.profile_image
        ? (res.user.profile_image =
            constant.AWS_S3_URL +
            constant.AWS_S3_PROJECT_FOLDER +
            constant.AWS_S3_USER_FOLDER +
            res.user.profile_image)
        : null;
    });

    return list_contact_us;
  },
};
