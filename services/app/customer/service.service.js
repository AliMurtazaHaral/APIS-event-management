/*
 * Summary:     service.services file for handling all SERVICE related actions (customer side).
 * Author:      Openxcell(empCode-496)
 */

/**require NPM-modules,models and constants for configuration */

const Category = require("../../../database/models").tbl_category;
const User = require("../../../database/models").tbl_user;
const Cart = require("../../../database/models").tbl_cart;
const ServiceBooking = require("../../../database/models").tbl_service_booking;
const Service = require("../../../database/models").tbl_service;
const Sequelize = require("sequelize");
const Event = require("../../../database/models").tbl_event;
const UserToken = require("../../../database/models").tbl_user_token;

const FcmService = require("../../../helper/fcm");
const Fcm = new FcmService();

const Op = Sequelize.Op;
const constant = require("../../../config/constant");
const imageupload = require("../../../middleware/multer_aws_upload");
const imageDelete = require("../../../middleware/multer_aws_delete");
const Stripe = require("../../../helper/stripe");
const random_string = require("../../../helper/general.helper");
const { sequelize } = require("../../../database/models");

module.exports = {
  //list service

  async list(req, res) {
    let { search, page } = req.body;
    const offset = (page - 1) * constant.LIMIT;
    const limit = constant.LIMIT;
    search = search === undefined ? "" : search;
    try {
      let where_obj = {
        is_deleted: false,
        where: Sequelize.where(
          Sequelize.literal(
            `6371 * acos(cos(radians(${req.body.latitude})) * cos(radians(service_latitude)) * cos(radians(${req.body.longitude}) - radians(service_longitude)) + sin(radians(${req.body.latitude})) * sin(radians(service_latitude)))`
          ),
          "<=",
          5000000
        ),
        [Op.or]: [
          {
            name: {
              [Op.like]: `%${search}%`,
            },
          },
        ],
        user_id: { [Op.ne]: req.user_id },
      };
      if (req.body.category_id && JSON.parse(req.body.category_id).length > 0) {
        where_obj.category_id = { [Op.in]: JSON.parse(req.body.category_id) };
      }
      if (req.body.from_rate && req.body.to_rate) {
        where_obj.rate = {
          [Op.between]: [
            parseFloat(req.body.from_rate),
            parseFloat(req.body.to_rate),
          ],
        };
      }
      let find_services = await Service.findAndCountAll({
        where: where_obj,
        attributes: {
          exclude: ["updatedAt"],
        },
        include: [
          {
            model: Category,
            as: "parent_category",
            attributes: ["category_id", "category_name"],
          },
          {
            model: Category,
            as: "sub_category",
            attributes: ["category_id", "category_name"],
          },
          {
            model: User,
            as: "user",
            attributes: ["user_id", "full_name", "is_plan_purchased", "latitude", "longitude"],
          },
        ],
        order: [[Sequelize.literal(`is_plan_purchased`), `DESC`]],
        offset: offset,
        limit: limit,
      });

      find_services.rows.forEach((data) => {
        if (data.image) {
          data.image =
            constant.AWS_S3_URL +
            constant.AWS_S3_PROJECT_FOLDER +
            constant.AWS_SERVICE_FOLDER +
            data.image;
        }
      });
      return find_services;
    } catch (error) {
      throw error;
    }
  },

  async buyService(req, res) {
    try {
      let order_id = "#SORDER_" + random_string.generateRandomString(5);
      console.log(
        "🚀 ~ file: service.service.js ~ line 105 ~ buyService ~ order_id",
        order_id
      );

      let {
        total_amount,
        stripe_customer_id,
        card_id,
        provider_amount,
        provider_account_id,
        provider_id,
        service_id,
        date,
        start_time,
        end_time,
        hours,
        rate,
        commission,
        event_id,
        cart_id,
      } = req.body;

      let order_obj = {
        order_id: order_id,
        total_amount: total_amount,
        stripe_customer_id: stripe_customer_id,
        card_id: card_id,
        provider_amount: provider_amount,
        provider_account_id: provider_account_id,
        provider_id: provider_id,
        customer_id: req.user_id,
        service_id: service_id,
        date: date,
        start_time: start_time,
        end_time: end_time,
        hours: hours,
        rate: rate,
        event_id: event_id,
        commission: commission,
      };

      let create_order = await ServiceBooking.create(order_obj);
      if (create_order) {
        if (cart_id) {
          await Cart.destroy({
            where: {
              cart_id: req.body.cart_id,
            },
          });
        }

        var find_sender = await User.findOne({
          where: {
            user_id: req.user_id,
          },
        });
        var find_receiver = await User.findOne({
          where: {
            user_id: provider_id,
            is_notification_on: true,
          },
        });
        var find_service = await Service.findOne({
          where: {
            service_id: service_id,
          },
          attributes: ["service_id", "name"],
        });

        if (find_receiver) {
          var find_tokens = await UserToken.findAll({
            where: {
              user_id: find_receiver.user_id,
              device_token: { [Op.ne]: null },
              device_type: { [Op.ne]: null },
            },
          });

          var tokens = [];
          var extra = {
            type: "service_booking",
            id: create_order.booking_id,
          };
          find_tokens.forEach((data) => {
            tokens.push(data.device_token);
          });

          await Fcm.createNotification(
            `Service request`,
            `${find_sender.full_name} requested for your service ${find_service.name}`,
            2,
            find_sender.user_id,
            find_receiver.user_id,
            event_id,
            null,
            find_service.service_id,
            extra
          );
          if (tokens.length) {
            await Fcm.sendNotifications(
              `Service request`,
              `${find_sender.full_name} requested for your service ${find_service.name}`,
              "2",
              tokens,
              extra
            );
          }
        }

        return 2;

        // try {
        //   let create_charge = await Stripe.createCharge(
        //     total_amount * 100,
        //     stripe_customer_id,
        //     card_id,
        //     order_id,
        //     provider_amount * 100,
        //     provider_account_id
        //   );
        //   console.log(
        //     "🚀 ~ file: service.service.js ~ line 103 ~ buyService ~ create_charge",
        //     create_charge
        //   );

        //   if (create_charge) {
        //     await ServiceBooking.update(
        //       {
        //         transaction_id: create_charge.id,
        //         transfer_id: create_charge.transfer,
        //         status: create_charge.status,
        //       },
        //       {
        //         where: {
        //           order_id: order_id,
        //         },
        //       }
        //     );
        //     if (cart_id) {
        //       await Cart.destroy({
        //         where: {
        //           cart_id: req.body.cart_id,
        //         },
        //       });
        //     }

        //     let find_order = ServiceBooking.findOne({
        //       where: {
        //         order_id: order_id,
        //       },
        //     });
        //     return find_order;
        //   }
        // } catch (errors) {
        //   await ServiceBooking.update(
        //     {
        //       transaction_id: errors.charge,
        //       status: "Failed",
        //     },
        //     {
        //       where: {
        //         order_id: order_id,
        //       },
        //     }
        //   );
        //   console.log("--", errors);
        //   return errors;
        // }
      } else {
        return 1;
      }
    } catch (error) {
      console.log("error ", error);
      throw error;
    }
  },

  async bookingList(req, res) {
    console.log("hi", req.user_id);
    let { search, page, type, user_type } = req.body;
    const offset = (page - 1) * constant.LIMIT;
    const limit = constant.LIMIT;
    search = search === undefined ? "" : search;

    let where_obj = {};

    if (user_type === "provider") {
      where_obj.provider_id = req.user_id;
    } else {
      where_obj.customer_id = req.user_id;
    }
    if (type === "upcoming") {
      where_obj.request_status = "accepted";
      where_obj.service_status = "pending";
      where_obj.payment_status = "succeeded";
    }
    if (type === "ongoing") {
      where_obj.service_status = "started";
    }
    if (type === "past") {
      where_obj[Op.or] = [
        { service_status: "completed" },
        { request_status: "rejected" },
      ];
    }
    console.log(where_obj);
    try {
      let find_service_booking = await ServiceBooking.findAndCountAll({
        where: where_obj,
        include: [
          {
            model: Service,
            as: "service",
            include: [
              {
                model: User,
                as: "user",
                attributes: [
                  "user_id",
                  "full_name",
                  "email",
                  "country_code",
                  "phone_number",
                  "profile_image",
                ],
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
        offset: offset,
        limit: limit,
      });
      find_service_booking.rows.map((result) => {
        if (result.service.user.profile_image) {
          result.service.user.profile_image =
            constant.AWS_S3_URL +
            constant.AWS_S3_PROJECT_FOLDER +
            constant.AWS_S3_USER_FOLDER +
            result.service.user.profile_image;
        } else {
          result.service.user.profile_image = null;
        }
      });
      return find_service_booking;
    } catch (error) {
      console.log('error ', error)
      throw error;
    }
  },
};
