/*
 * Summary:     user.services file for handling all USER related actions.
 * Author:      Openxcell(empCode-496)
 */

/**require NPM-modules,models and constants for configuration */
const User = require("../../database/models").tbl_user;
const UserToken = require("../../database/models").tbl_user_token;
const Event = require("../../database/models").tbl_event;
const Notification = require("../../database/models").tbl_notification;
const EventTicket = require("../../database/models").tbl_event_ticket;
const EventMedia = require("../../database/models").tbl_event_media;
const Service = require("../../database/models").tbl_service;
const Review = require("../../database/models").tbl_review;
const EventBooking = require("../../database/models").tbl_event_purchase;
const ServiceBooking = require("../../database/models").tbl_service_booking;
const Setting = require("../../database/models").tbl_setting;
const ContactUs = require("../../database/models").tbl_contact_us;
const StaticContent = require("../../database/models").tbl_static_content;
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const constant = require("../../config/constant");
const Mail = require("../../helper/sendmail");
const randomStringHelper = require("../../helper/general.helper");
const imageupload = require("../../middleware/multer_aws_upload");
const imageDelete = require("../../middleware/multer_aws_delete");
const Stripe = require("../../helper/stripe");
const jwt = require("jsonwebtoken");
const schedule = require("node-schedule");
const { Account } = require("aws-sdk");
module.exports = {
  /* signup */

  async signup(req, res) {
    let find_user = await User.count({
      where: {
        [Op.or]: [
          {
            email: req.body.email,
          },
          // { phone_number: req.body.phone_number },
        ],
      },
    });

    if (find_user) {
      return 1;
    } else {
      console.log("req.body", req.body);
      let signupObj = {
        full_name: req.body.full_name,
        email: req.body.email,
        password: req.body.password,
        country_code: req.body.country_code,
        phone_number: req.body.phone_number,
        profile_image: req.body.profile_image,
        type: req.body.type,
        approval_status: "approved",
        verification_token: randomStringHelper.generateRandomString(5),
      };

      let create_profile = await User.create(signupObj);
      if (req.file) {
        await User.update(
          {
            profile_image: create_profile.user_id + "_" + req.file.originalname,
          },
          { where: { user_id: create_profile.user_id } }
        );
        let data = await imageupload(
          req.file,
          constant.AWS_S3_PROJECT_FOLDER +
          constant.AWS_S3_USER_FOLDER +
          create_profile.user_id +
          "_" +
          req.file.originalname
        );
      }
      // if (req.body.type === "customer") {
      //   await User.update(
      //     {
      //       approval_status: "approved",
      //     },
      //     {
      //       where: {
      //         user_id: create_profile.user_id,
      //       },
      //     }
      //   );
      // }
      var subject = "Regarding email verification";
      let encryptId = randomStringHelper.encrypt(
        create_profile.user_id.toString()
      );
      var mailbody =
        "<div><p>Hello " +
        create_profile.full_name +
        ",<p>" +
        '<p><a href="' +
        constant.API_URL +
        "user/" +
        "email-verify/" +
        encryptId.iv +
        "/" +
        encryptId.encryptedData +
        "/" +
        create_profile.verification_token +
        '"> Click here</a>' +
        "" +
        " to verify your email.</p>" +
        "</div>";
      console.log('mailBody', mailbody)
      let data = await Mail.sendmail(
        res,
        create_profile.email,
        subject,
        mailbody
      );
      return create_profile;
    }
  },

  /* email verification */

  async emailVerification(params) {
    try {
      let decrypts = {
        iv: params.token_iv,
        encryptedData: params.token_enc,
      };

      let decryptData = randomStringHelper.decrypt(decrypts);
      let checkEmail = await User.findOne({
        where: {
          verification_token: params.verification_token,
          user_id: decryptData,
          is_email_verified: false,
          is_deleted: false,
        },
      });

      if (checkEmail) {
        let updateFlag = await User.update(
          { is_email_verified: true, verification_token: null },
          {
            where: {
              user_id: decryptData,
            },
          }
        );
        console.log(checkEmail)
        return checkEmail;
      } else {
        return 1; //already verified
      }
    } catch (error) {
      throw error;
    }

  },

  /* plan purchse */

  async planPurchase(req, res) {
    let { month, price, user_id } = req.body;

    //get today date
    let today = new Date();
    //let today = new Date("2021-10-1");

    //function for gettings expiration date as per subscription plan
    function current_date(today, n) {
      return new Date(today.setMonth(today.getMonth() + parseInt(n)));
    }
    //get timestamp for expiration
    let something = Date.parse(current_date(today, month));

    //update subsctiption plan
    console.log(something)
    var currentDate = new Date(something);
    var date = new Date(currentDate);


    // var date = new Date(something);
    let cronDate = `${date.getFullYear()},${date.getMonth() + 1},${date.getDate()},${date.getHours()},${date.getMinutes()},${date.getSeconds()}`;

    let update_plan = await User.update(
      {
        price: price,
        expiration_date: something,
        month: month,
        is_plan_purchased: true,
      },
      {
        where: {
          user_id: user_id,
        },
      }
    );
    if (update_plan) {
      const job = schedule.scheduleJob(date, async function () {
        console.log(`Corn scheduled for ${date} `);

        await User.update(
          {
            price: null,
            expiration_date: null,
            month: null,
            is_plan_purchased: false,
          },
          {
            where: {
              user_id: user_id,
            },
          }
        );

        job.cancel();
      });

      return 1;
    } else {
      return 0;
    }
  },

  async updateUserVerification(req, res) {
    const user = await User.update({
      is_verification_done: true
    },
      {
        where: {
          user_id: req.user_id
        }
      });
    return user;
  },

  /* login */

  async login(req, res) {
    let { phone_number, email } = req.body;
    let where_obj = {};
    if (phone_number) {
      (where_obj.phone_number = phone_number), (where_obj.is_deleted = false);
    }
    if (email) {
      (where_obj.email = email), (where_obj.is_deleted = false);
    }
    let find_user = await User.findOne({
      where: where_obj,
      attributes: {
        exclude: ["verification_token", "updatedAt"],
      },
    });
    if (!find_user) {
      return 1;
    } else {
      if (!find_user.password) {
        return 6;
      }
      if (!find_user.is_active) {
        return 2;
      }
      if (!find_user.is_email_verified) {
        return 3;
      }
      if (!find_user.validatePassword(req.body.password)) {
        return 7; //password not valid
      }
      if (find_user.type === "provider") {
        let current_date = Date.now();
        // if (find_user.approval_status === "pending") {
        //   return 4;
        // }
        // if (find_user.approval_status === "rejected") {
        //   return 5;
        // }
        // if (find_user.expiration_date) {
        //   find_user.dataValues.is_plan_purchased = true;
        //   if (current_date < find_user.expiration_date) {
        //     find_user.dataValues.is_plan_expire = false;
        //   } else {
        //     find_user.dataValues.is_plan_expire = true;
        //   }
        // } else {
        //   find_user.dataValues.is_plan_purchased = false;
        // }
      }
      let jwt_token = jwt.sign(
        {
          phone_number: find_user.phone_number,
          user_id: find_user.user_id,
        },
        constant.JWT_APP_TOKEN.secret,
        { algorithm: constant.JWT_APP_TOKEN.algo }
      );
      if (find_user.profile_image) {
        find_user.profile_image =
          constant.AWS_S3_URL +
          constant.AWS_S3_PROJECT_FOLDER +
          constant.AWS_S3_USER_FOLDER +
          find_user.profile_image;
      }
      await UserToken.create({
        token: jwt_token,
        user_id: find_user.user_id,
        device_type: req.body.device_type,
        device_token: req.body.device_token,
      });
      find_user.dataValues.token = jwt_token;
      delete find_user.dataValues.approval_status;
      delete find_user.dataValues.is_active;
      delete find_user.dataValues.expiration_date;
      delete find_user.dataValues.is_email_verified;
      delete find_user.dataValues.is_deleted;
      delete find_user.dataValues.price;
      delete find_user.dataValues.createdAt;
      delete find_user.dataValues.password;

      return find_user;
    }
  },

  /* check plan validity */

  async planValidity(req, res) {
    let current_date = Date.now();

    let find_user = await User.findOne({
      where: {
        user_id: req.user_id,
      },
      attributes: ["expiration_date", "is_plan_purchased", "month"],
    });

    if (current_date < find_user.expiration_date) {
      return find_user;
    } else {
      await User.update(
        {
          is_plan_purchased: false,
        },
        {
          where: {
            user_id: req.user_id,
          },
        }
      );
    }
    return 0;
  },

  /* view by id */

  async viewById(req, res) {
    find_user = await User.findOne({
      where: {
        user_id: req.params.id,
        is_deleted: false,
      },
      attributes: {
        exclude: ["updatedAt", "createdAt", "is_deleted", "is_email_verified"],
      },
    });
    if (find_user.profile_image) {
      find_user.profile_image =
        constant.AWS_S3_URL +
        constant.AWS_S3_PROJECT_FOLDER +
        constant.AWS_S3_USER_FOLDER +
        find_user.profile_image;
    } else {
      find_user.profile_image = null;
    }

    let setting = await Setting.findAll({
      attributes: ["setting_id", "name", "value"],
    });
    if (setting) {
      find_user.dataValues.setting = setting;
    }

    if (req.body.fcm_token) {
      await UserToken.update(
        {
          device_token: req.body.fcm_token,
        },
        {
          where: {
            token: req.token,
          },
        }
      );
    }
    return find_user;
  },

  /* view by token */

  async viewByToken(req, res) {
    let find_user = await User.findOne({
      where: {
        user_id: req.user_id,
        is_deleted: false,
      },
      attributes: {
        exclude: ["updatedAt", "createdAt", "is_deleted", "is_email_verified"],
      },
    });
    if (find_user.profile_image) {
      find_user.profile_image =
        constant.AWS_S3_URL +
        constant.AWS_S3_PROJECT_FOLDER +
        constant.AWS_S3_USER_FOLDER +
        find_user.profile_image;
    } else {
      find_user.profile_image = null;
    }

    let setting = await Setting.findAll({
      attributes: ["setting_id", "name", "value"],
    });
    if (setting) {
      find_user.dataValues.setting = setting;
    }

    if (req.body.fcm_token) {
      await UserToken.update(
        {
          device_token: req.body.fcm_token,
        },
        {
          where: {
            token: req.token,
          },
        }
      );
    }
    let find_review_count = await Notification.count({
      where: {
        receiver_id: req.user_id,
        is_read: false,
      },
    });
    find_user.dataValues.unread_count = find_review_count;
    delete find_user.dataValues.password;
    return find_user;
  },

  /* update user */

  async updateProfile(req, res) {
    if (req.file) {
      let find_user = await User.findOne({
        where: { user_id: req.user_id },
      });

      await imageDelete(
        constant.AWS_S3_PROJECT_FOLDER +
        constant.AWS_S3_USER_FOLDER +
        find_user.profile_image
      );

      await imageupload(
        req.file,
        constant.AWS_S3_PROJECT_FOLDER +
        constant.AWS_S3_USER_FOLDER +
        req.user_id +
        "_" +
        req.file.originalname
      );
    }
    await User.update(
      {
        profile_image: req.file && req.user_id + "_" + req.file.originalname,
        full_name: req.body.full_name,
        address: req.body.address,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        about: req.body.about,
      },
      { where: { user_id: req.user_id } }
    );
    let find_updated_user = await User.findOne({
      where: { user_id: req.user_id },
      attributes: [
        "user_id",
        "full_name",
        "email",
        "country_code",
        "phone_number",
        "profile_image",
        "address",
        "latitude",
        "longitude",
        "about",
      ],
    });
    if (find_updated_user.profile_image) {
      find_updated_user.profile_image =
        constant.AWS_S3_URL +
        constant.AWS_S3_PROJECT_FOLDER +
        constant.AWS_S3_USER_FOLDER +
        find_updated_user.profile_image;
    }
    return find_updated_user;
  },

  /* update bank details */

  async updateBankDetail(req, res) {
    let { email, name } = req.body;
    let acccount = await Stripe.createProviderAccount(email);
    console.log('account', acccount);
    let customer_account = await Stripe.createCustomer(email, name);
    console.log('custormer_account', customer_account);
    let update_stripe_id = await User.update(
      {
        stripe_account_id: acccount.id,
        stripe_customer_id: customer_account.id,
      },
      {
        where: {
          user_id: req.user_id,
        },
      }
    );
    return update_stripe_id;
  },

  /* contactus */

  async contactUs(req, res) {
    let { subject, comment } = req.body;

    await ContactUs.create({
      user_id: req.user_id,
      subject: subject,
      comment: comment,
    });
  },
  /* logout */

  async logout(req, res) {
    try {
      await UserToken.destroy({
        where: {
          token: req.headers.authorization,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  /* static content*/

  async staticPages(req, res) {
    try {
      let { type } = req.body;

      let where_obj = {};
      if (type === "privacy") {
        where_obj.static_content_id = 1;
      }
      if (type === "aboutus") {
        where_obj.static_content_id = 7;
      }
      if (type === "faq") {
        where_obj.static_content_id = 8;
      }
      if (type === "tc") {
        where_obj.static_content_id = 3;
      }

      let content = await StaticContent.findOne({
        where: where_obj,
        attributes: ["static_content_id", "title", "content"],
      });
      return content;
    } catch (error) {
      throw error;
    }
  },

  //setting

  async setting(req, res) {
    try {
      let setting = await Setting.findAll({
        attributes: ["setting_id", "name", "value"],
      });
      return setting;
    } catch (error) {
      throw error;
    }
  },

  //add review
  async addReview(req, res) {
    let { review, rating, provider_id } = req.body;

    let add_review = await Review.create({
      review: review,
      rating: rating,
      provider_id: provider_id,
      given_by_id: req.user_id,
    });
    return add_review;
  },

  //change password
  async changePassword(req, res) {
    console.log("jo");
    try {
      let check_password = await User.findOne({
        where: { user_id: req.user_id },
      });
      if (check_password.validatePassword(req.body.current_password)) {
        await User.update(
          { password: req.body.new_password },
          { where: { user_id: req.user_id }, individualHooks: true }
        );
        return 1;
      }
      return 0;
    } catch (error) { }
  },

  //forgot password
  async forgotPassword(req, res) {
    let { email } = req.body;

    let find_user = await User.findOne({
      where: {
        email: email,
        is_deleted: false,
      },
    });
    if (!find_user) {
      return 1;
    } else {
      var subject = "Regarding password change";
      let encryptId = randomStringHelper.generateRandomString(10);
      var mailbody =
        "<div><p>Hello " +
        find_user.full_name +
        ",<p>" +
        '<p><a href="' +
        constant.RESET_PASSWORD_URL +
        `?email=${find_user.email}&k=${encryptId}` +
        '"> Click here</a>' +
        "" +
        " to reset your password.</p>" +
        "</div>";

      await User.update(
        {
          password_token: encryptId,
        },
        { where: { user_id: find_user.user_id } }
      );

      let data = await Mail.sendmail(res, find_user.email, subject, mailbody);

      return 2;
    }
  },

  //reset password
  async resetPassword(req, res) {
    console.log("hi", req.body);
    let { email, token, new_password } = req.body;
    let find_user = await User.findOne({
      where: {
        email: email,
        password_token: token,
      },
    });
    if (!find_user) {
      return 2;
    } else {
      let update = await User.update(
        { password: new_password, password_token: null },
        { individualHooks: true, where: { email: email } }
      );
      return update;
    }
  },

  //Earning

  async earning(req, res) {
    let { user_type } = req.query;

    let find_earn = [];
    let find_event_earning = await EventBooking.findAll({
      where: {
        provider_id: req.user_id,
        payment_status: "succeeded",
      },
      distinct: true,
      include: [
        {
          model: Event,
          as: "event",
          include: [
            {
              model: EventMedia,
              as: "media",
              attributes: ["event_media_id", "image"],
            },
          ],
          attributes: [
            "event_id",
            "user_id",
            "name",
            "address",
            "start_date",
            "end_date",
            "start_time",
            "end_time",
            "about",
          ],
        },
        {
          model: EventTicket,
          as: "event_ticket",
          attributes: ["event_ticket_id", "event_id", "type"],
        },
        {
          model: User,
          as: "provider",
          attributes: ["full_name"]
        },
        {
          model: User,
          as: "customer",
          attributes: ["full_name"]
        }
      ],
    });
    find_event_earning.forEach((result) => {
      result.type = "event";
      find_earn.push(result);
    });
    if (user_type === "provider") {
      let find_service_earn = await ServiceBooking.findAll({
        where: {
          provider_id: req.user_id,
          payment_status: "succeeded",
        },
        include: [
          {
            model: Service,
            as: "service",
          },
          {
            model: User,
            as: "provider",
            attributes: ["full_name"]
          },
          {
            model: User,
            as: "customer",
            attributes: ["full_name"]
          }
        ],
      });
      // return find_service_earn
      find_service_earn.forEach((result) => {
        if (result.service.image) {
          result.service.image =
            constant.AWS_S3_URL +
            constant.AWS_S3_PROJECT_FOLDER +
            constant.AWS_SERVICE_FOLDER +
            result.service.image;
        } else {
          result.service.image = null;
        }

        result.type = "service";
        find_earn.push(result);
      });
      // return find_service_earn;
    }
    find_earn.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return find_earn;
  },

  //Transaction

  async transaction(req, res) {
    let { user_type } = req.body;
    let find_earn = [];
    let find_event_earning = await EventBooking.findAll({
      where: { customer_id: req.user_id, payment_status: "succeeded" },
      distinct: true,
      include: [
        {
          model: Event,
          as: "event",
          include: [
            {
              model: EventMedia,
              as: "media",
              attributes: ["event_media_id", "image"],
            },
          ],
          attributes: [
            "event_id",
            "user_id",
            "name",
            "address",
            "start_date",
            "end_date",
            "start_time",
            "end_time",
            "about",
          ],
        },
        {
          model: EventTicket,
          as: "event_ticket",
          attributes: ["event_ticket_id", "event_id", "type"],
        },
      ],
    });
    find_event_earning.forEach((result) => {
      result.type = "event";
      find_earn.push(result);
    });
    let find_service_earn = await ServiceBooking.findAll({
      where: {
        customer_id: req.user_id,
        payment_status: "succeeded"
      },

      include: [
        {
          model: Service,
          as: "service",
          include:{
            model: User,
            as: "user",
            attributes: ["full_name"]
          }
        },
      ],
    });
    // return find_service_earn
    find_service_earn.forEach((result) => {
      if (result.service.image) {
        result.service.image =
          constant.AWS_S3_URL +
          constant.AWS_S3_PROJECT_FOLDER +
          constant.AWS_SERVICE_FOLDER +
          result.service.image;
      } else {
        result.service.image = null;
      }

      result.type = "service";
      find_earn.push(result);
    });
    // return find_service_earn;

    find_earn.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return find_earn;
  },

  //notification list
  async notificationList(req, res) {
    let { page } = req.body;
    const offset = (page - 1) * constant.LIMIT;
    const limit = constant.LIMIT;
    var find_notification_list = await Notification.findAndCountAll({
      where: {
        receiver_id: req.user_id,
      },
      include: [
        {
          model: Event,
          as: "event",
          attributes: ["event_id", "name"],
        },
        {
          model: User,
          as: "sender",
          attributes: ["user_id", "full_name", "profile_image"],
        },
        {
          model: EventTicket,
          as: "event_ticket",
          attributes: ["event_ticket_id", "type"],
        },
        {
          model: Service,
          as: "service",
          attributes: ["service_id", "name"],
        },
      ],
      order: [["createdAt", "DESC"]],
      offset: offset,
      limit: limit,
    });
    find_notification_list.rows.map((result) => {
      result.message = JSON.parse(result.message);
      result.message.data.data = JSON.parse(result.message.data.data);

      result.sender.profile_image = result.sender.profile_image
        ? constant.AWS_S3_URL +
        constant.AWS_S3_PROJECT_FOLDER +
        constant.AWS_S3_USER_FOLDER +
        result.sender.profile_image
        : null;

      if (result.notification_type === 1) {
        result.message.notification.body = `${result.sender.full_name
          } purchased ${result.message.notification.body
          } ${result.event_ticket.type.toLowerCase()} ${parseInt(result.message.notification.body) === 1
            ? "ticket"
            : "tickets"
          } for your event ${result.event.name.toLowerCase()}`;
      }
      if (result.notification_type === 2) {
        result.message.notification.body = `${result.sender.full_name
          } requested for your service ${result.service.name.toLowerCase()}`;
      }
      if (result.notification_type === 3) {
        result.message.notification.body = `${result.sender.full_name
          } accepted your service request for ${result.service.name.toLowerCase()}`;
      }
      if (result.notification_type === 4) {
        result.message.notification.body = `${result.service.name} service request rejected due to payment issues`;
      }
      if (result.notification_type === 5) {
        result.message.notification.body = `${result.sender.full_name
          } rejected your service request for ${result.service.name.toLowerCase()}`;
      }

      delete result.dataValues.event;
      delete result.dataValues.event_ticket;
      delete result.dataValues.service;
      delete result.dataValues.sender_id;
      delete result.dataValues.service_id;
      delete result.dataValues.event_ticket_id;
      delete result.dataValues.event_id;
      delete result.dataValues.updatedAt;
    });

    await Notification.update(
      {
        is_read: true,
      },
      {
        where: {
          receiver_id: req.user_id,
        },
      }
    );
    return find_notification_list;
  },

  //notification status change
  async notificationStatusChange(req, res) {
    let { notification_status } = req.body;
    let status_change = await User.update(
      {
        is_notification_on: notification_status,
      },
      {
        where: {
          user_id: req.user_id,
        },
      }
    );
    return status_change;
  },

  //review list

  async reviewList(req, res) {
    var review_list = await Review.findAndCountAll({
      where: {
        provider_id: req.params.id,
      },
      include: [
        {
          model: User,
          as: "given_by",
          attributes: ["user_id", "full_name", "profile_image"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    review_list.rows.map((res) => {
      if (res.given_by.profile_image) {
        res.given_by.profile_image =
          constant.AWS_S3_URL +
          constant.AWS_S3_PROJECT_FOLDER +
          constant.AWS_S3_USER_FOLDER +
          res.given_by.profile_image;
      } else {
        res.given_by.profile_image = null;
      }
    });

    return review_list;
  },

  // mail client with the response body 
  async postMailToClient(req, res) {
    try {
      const { email, name, occupation, countryCode, contact } = req.body;
      const numberWithCc = `${countryCode}${contact}`;
      const userDetails = `Email: ${email} <br/> Name: ${name} <br/> Occupation: ${occupation} <br/> Contact: ${numberWithCc}`;
      const sendMail = await Mail.sendmail(res, "cbjlwatson@gmail.com", "Service provider details", userDetails);
      if (sendMail) {
        return 1;
      } else {
        return 0;
      }
    } catch (e) {
      console.log('error', e);
      return;
    }
  },

  // delete user account and details
  async deleteUserAccountAndDetails(req, res) {
    try {
      if (!req.body.email || !req.body.password) {
        return 1;
      }

      let findUser = await User.findOne({
        where: {
          email: req.body.email,
          is_active: true,
          is_email_verified: true,
          is_deleted: false
        }
      });

      if (!findUser) {
        return 2; // user not found
      }

      if (!findUser.validatePassword(req.body.password)) {
        return 3; // credentials does'nt match 
      } else {
        let [deleteUserAccount] = await User.update(
          {
            is_deleted: true,
          },
          {
            where: {
              user_id: findUser.user_id
            }
          }
        )

        if (deleteUserAccount === 1) {

          await UserToken.destroy({
            where: {
              user_id: findUser.user_id,
            },
          });

          await Service.update(
            {
              is_deleted: true,
            },
            {
              where: {
                user_id: findUser.user_id
              }
            }
          );

          await Event.update(
            {
              is_deleted: true,
            },
            {
              where: {
                user_id: findUser.user_id
              }
            }
          );

          return 4; // success
        }
        return 5; // unable to process the request, Try agian
      }
    } catch (error) {
      console.log('error ', error);
      throw error;
    }
  }
};
