/*
 * Summary:     event.services file for handling all event - CMS related actions.
 * Author:      Openxcell(empCode-496)
 */

/**require NPM-modules,models and constants for configuration */
const category = require("../../database/models").tbl_category;
const event = require("../../database/models").tbl_event;
const ServiceBooking = require("../../database/models").tbl_service_booking;
const Service = require("../../database/models").tbl_service;
const EventTicket = require("../../database/models").tbl_event_ticket;
const EventMedia = require("../../database/models").tbl_event_media;
const User = require("../../database/models").tbl_user;
const EventBooking = require("../../database/models").tbl_event_purchase;

const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const constant = require("../../config/constant");
const xlsx = require("node-xlsx");

module.exports = {
  /* List Event */

  async list(req, res) {
    let { sort_by, order, search, page } = req.body;
    const offset = (page - 1) * constant.LIMIT;
    const limit = constant.LIMIT;
    let searchObj;
    search = search === undefined ? "" : search;
    searchObj = {
      where: {
        is_deleted: false,
        [Op.or]: [
          {
            name: {
              [Op.like]: `%${search}%`,
            },
          },
        ],
      },
    };
    let list_event = await event.findAndCountAll({
      where: searchObj.where,
      include: [
        {
          model: EventTicket,
          as: "tickets",
          where: {
            is_deleted: false,
          },
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
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
        {
          model: EventMedia,
          as: "media",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
        {
          model: ServiceBooking,
          as: "service_booked",
          required: false,
          where: {
            payment_status: "succeeded",
          },
          include: [
            {
              model: Service,
              as: "service",
              attributes: ["service_id", "name", "image"],
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
        },
      ],
      distinct: true,
      order: [[Sequelize.literal(`${sort_by}`), `${order}`]],
      offset: offset,
      limit: limit,
    });

    list_event.rows.forEach((element) => {
      element.user.profile_image
        ? (element.user.profile_image =
            constant.AWS_S3_URL +
            constant.AWS_S3_PROJECT_FOLDER +
            constant.AWS_S3_USER_FOLDER +
            element.user.profile_image)
        : (element.user.profile_image = null);

      element.service_booked.forEach((result) => {
        //  -service image
        if (result.service.image) {
          result.service.image =
            constant.AWS_S3_URL +
            constant.AWS_S3_PROJECT_FOLDER +
            constant.AWS_SERVICE_FOLDER +
            result.service.image;
        } else {
          result.service.image = null;
        }

        //-service provider user image
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
    });

    return list_event;
  },

  //list event purchase

  async listEventPurchase(req, res) {
    let { sort_by, order, search, page } = req.body;
    const offset = (page - 1) * constant.LIMIT;
    const limit = constant.LIMIT;
    let searchObj;
    search = search === undefined ? "" : search;

    let list_event_purchase = await EventBooking.findAndCountAll({
      attributes: {
        exclude: [
          "stripe_customer_id",
          "provider_account_id",
          "card_id",
          "transfer_id",
        ],
      },
      where: {
        [Op.or]: [
          {
            "$event.name$": {
              [Op.like]: `%${search}%`,
            },
          },
          {
            "$order_id$": {
              [Op.like]: `%${search}%`,
            },
          },
          {
            "$total_amount$": {
              [Op.like]: `%${search}%`,
            },
          },
        ],
      },
      include: [
        {
          model: event,
          as: "event",
          include: [
            // {
            //   model: EventMedia,
            //   as: "media",
            //   attributes: ["event_media_id", "image"],
            //   required:true
            // },
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
          model: User,
          as: "customer",
          attributes: [
            "user_id",
            "full_name",
            "email",
            "country_code",
            "phone_number",
            "profile_image",
          ],
        },
        {
          model: EventTicket,
          as: "event_ticket",
          attributes: ["event_ticket_id", "event_id", "type"],
        },
      ],
      subQuery: false,
      distinct: true,
      order: [[Sequelize.literal(`${sort_by}`), `${order}`]],
      offset: offset,
      limit: limit,
    });

    list_event_purchase.rows.forEach((element) => {
      element.customer.profile_image
        ? (element.customer.profile_image =
            constant.AWS_S3_URL +
            constant.AWS_S3_PROJECT_FOLDER +
            constant.AWS_S3_USER_FOLDER +
            element.customer.profile_image)
        : (element.customer.profile_image = null);

      element.event.user.profile_image
        ? (element.event.user.profile_image =
            constant.AWS_S3_URL +
            constant.AWS_S3_PROJECT_FOLDER +
            constant.AWS_S3_USER_FOLDER +
            element.event.user.profile_image)
        : (element.event.user.profile_image = null);
    });

    return list_event_purchase;
  },

  //list event purchase

  async listServiceBooking(req, res) {
    let { sort_by, order, search, page } = req.body;
    const offset = (page - 1) * constant.LIMIT;
    const limit = constant.LIMIT;

    search = search === undefined ? "" : search;

    let list_event_purchase = await ServiceBooking.findAndCountAll({
      attributes: {
        exclude: [
          "stripe_customer_id",
          "provider_account_id",
          "card_id",
          "transfer_id",
        ],
      },
      where:{
        [Op.or]: [
          {
            "$event.name$": {
              [Op.like]: `%${search}%`,
            },
          },
          {
            "$order_id$": {
              [Op.like]: `%${search}%`,
            },
          },
          {
            "$total_amount$": {
              [Op.like]: `%${search}%`,
            },
          },
        ],
      },
      include: [
        {
          model: event,
          as: "event",
          attributes: {
            exclude: ["updatedAt", "is_stop_selling", "is_deleted"],
          },
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

        {
          model: Service,
          as: "service",
        },
        {
          model: User,
          as: "provider",
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
      subQuery: false,
      order: [[Sequelize.literal(`${sort_by}`), `${order}`]],
      offset: offset,
      limit: limit,
    });

    list_event_purchase.rows.map((element) => {
      if (element.event.user.profile_image) {
        element.event.user.profile_image =
          constant.AWS_S3_URL +
          constant.AWS_S3_PROJECT_FOLDER +
          constant.AWS_S3_USER_FOLDER +
          element.event.user.profile_image;
      } else {
        element.event.user.profile_image = null;
      }

      if (element.provider.profile_image) {
        element.provider.profile_image =
          constant.AWS_S3_URL +
          constant.AWS_S3_PROJECT_FOLDER +
          constant.AWS_S3_USER_FOLDER +
          element.provider.profile_image;
      } else {
        element.provider.profile_image = null;
      }

      if (element.service.image) {
        element.service.image =
          constant.AWS_S3_URL +
          constant.AWS_S3_PROJECT_FOLDER +
          constant.AWS_SERVICE_FOLDER +
          element.service.image;
      }
    });
    return list_event_purchase;
  },
};
