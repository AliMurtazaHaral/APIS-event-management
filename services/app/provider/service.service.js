/*
 * Summary:     service.services file for handling all SERVICE related actions.
 * Author:      Openxcell(empCode-496)
 */

/**require NPM-modules,models and constants for configuration */

const Category = require("../../../database/models").tbl_category;
const User = require("../../../database/models").tbl_user;
const Service = require("../../../database/models").tbl_service;
const Event = require("../../../database/models").tbl_event;
const ServiceBooking = require("../../../database/models").tbl_service_booking;
const RecentWorkMedia = require("../../../database/models").tbl_recent_work;
const Review = require("../../../database/models").tbl_review;
const UserToken = require("../../../database/models").tbl_user_token;

const FcmService = require("../../../helper/fcm");
const Fcm = new FcmService();

const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const constant = require("../../../config/constant");
const imageupload = require("../../../middleware/multer_aws_upload");
const imageDelete = require("../../../middleware/multer_aws_delete");
const Stripe = require("../../../helper/stripe");

module.exports = {
  //add service

  async add(req, res) {
    try {
      let { name, category_id, sub_category_id, rate, service_latitude, service_longitude, service_location } = req.body;

      let service_add = await Service.create({
        name: name,
        user_id: req.user_id,
        category_id: category_id,
        sub_category_id: sub_category_id,
        rate: rate,
        image: null,
        service_longitude,
        service_latitude,
        service_location
      });
      if (req.file) {
        await Service.update(
          {
            image: service_add.service_id + "_" + req.file.originalname,
          },
          { where: { service_id: service_add.service_id } }
        );
        let data = await imageupload(
          req.file,
          constant.AWS_S3_PROJECT_FOLDER +
          constant.AWS_SERVICE_FOLDER +
          service_add.service_id +
          "_" +
          req.file.originalname
        );
      }
      await User.update(
        {
          is_service_created: true,
        },
        {
          where: {
            user_id: req.user_id,
          },
        }
      );
    } catch (error) {
      throw error;
    }
  },

  //list service

  async list(req, res) {
    const offset = (req.body.page - 1) * constant.LIMIT;
    const limit = constant.LIMIT;

    try {
      let where = {
        is_deleted: false,
        user_id: req.user_id
      }

      if (req.body.category_id && JSON.parse(req.body.category_id).length > 0) {
        where.category_id = { [Op.in]: JSON.parse(req.body.category_id) };
      }

      if (req.body.from_rate && req.body.to_rate) {
        where.rate = {
          [Op.between]: [
            parseFloat(req.body.from_rate),
            parseFloat(req.body.to_rate),
          ],
        };
      }

      let find_services = await Service.findAndCountAll({
        where,
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
            attributes: ["user_id", "full_name", "is_plan_purchased", "address", "latitude", "longitude"],
          },
        ],
        order: [["createdAt", "DESC"]],
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

  //edit service

  async update(req, res) {
    let { name, category_id, sub_category_id, rate, service_latitude, service_longitude, service_location } = req.body;
    let find_service = await Service.findOne({
      where: {
        service_id: req.params.id,
      },
    });

    if (req.file) {
      if (find_service.image) {
        imageDelete(
          await imageDelete(
            constant.AWS_S3_PROJECT_FOLDER +
            constant.AWS_SERVICE_FOLDER +
            find_service.image
          )
        );
      }

      let data = await imageupload(
        req.file,
        constant.AWS_S3_PROJECT_FOLDER +
        constant.AWS_SERVICE_FOLDER +
        req.params.id +
        "_" +
        req.file.originalname
      );
    }
    let service_update = await Service.update(
      {
        name: name && name,
        category_id: category_id && category_id,
        sub_category_id: sub_category_id && sub_category_id,
        rate: rate && rate,
        image: req.file && req.params.id + "_" + req.file.originalname,
        service_latitude,
        service_longitude,
        service_location
      },
      {
        where: {
          service_id: req.params.id,
        },
      }
    );
  },

  //view service

  async viewById(req, res) {
    try {
      let view_service = await Service.findOne({
        where: {
          service_id: req.params.id,
        },
        attributes: {
          exclude: ["updatedAt"],
        },
        subQuery: false,
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
            attributes: [
              "user_id",
              "full_name",
              "email",
              "country_code",
              "phone_number",
              "profile_image",
              "about",
              "latitude",
              "longitude",
              "stripe_account_id",
              "stripe_customer_id",
              // [Sequelize.fn("AVG", Sequelize.col("user.reviews.rating")), "rating_avg"],
            ],

            include: [
              {
                model: RecentWorkMedia,
                as: "recent_work",
                order: [["createdAt", "DESC"]],
                separate: true,
              },
              {
                model: Review,
                as: "reviews",
                attributes: [
                  "review_id",
                  "given_by_id",
                  "review",
                  "rating",
                  "createdAt",
                ],
                order: [["createdAt", "DESC"]],
                limit: 3,
                include: [
                  {
                    model: User,
                    as: "given_by",
                    attributes: ["user_id", "full_name", "profile_image"],
                  },
                ],
              },
            ],
          },
        ],
      });

      if (view_service.image) {
        view_service.image =
          constant.AWS_S3_URL +
          constant.AWS_S3_PROJECT_FOLDER +
          constant.AWS_SERVICE_FOLDER +
          view_service.image;
      } else {
        view_service.image = null;
      }
      if (view_service.user.profile_image) {
        view_service.user.profile_image =
          constant.AWS_S3_URL +
          constant.AWS_S3_PROJECT_FOLDER +
          constant.AWS_S3_USER_FOLDER +
          view_service.user.profile_image;
      } else {
        view_service.user.profile_image = null;
      }

      if (view_service.user.reviews.length) {
        let rating = 0;
        view_service.user.reviews.forEach((result) => {
          rating += result.rating;
          if (result.given_by.profile_image) {
            result.given_by.profile_image =
              constant.AWS_S3_URL +
              constant.AWS_S3_PROJECT_FOLDER +
              constant.AWS_S3_USER_FOLDER +
              result.given_by.profile_image;
          } else {
            result.given_by.profile_image = null;
          }
        });
        view_service.user.dataValues.average_rating =
          rating / view_service.user.reviews.length;
      } else {
        view_service.user.dataValues.average_rating = 0;
      }

      return view_service;
    } catch (error) {
      throw error;
    }
  },

  //update request

  async updateRequest(req, res) {
    let find_booking = await ServiceBooking.findOne({
      where: {
        booking_id: req.params.id,
      },
    });
    var find_sender = await User.findOne({
      where: {
        user_id: find_booking.provider_id,
      },
    });
    var find_receiver = await User.findOne({
      where: {
        user_id: find_booking.customer_id,
        is_notification_on: true,
      },
    });
    var find_service = await Service.findOne({
      where: {
        service_id: find_booking.service_id,
      },
      attributes: ["service_id", "name"],
    });
    var find_event;
    if (find_booking.event_id) {
      find_event = await Event.findOne({
        where: {
          event_id: find_booking.event_id,
        },
        attributes: ["event_id", "name"],
      });
    }


    if (req.body.response === "accept") {
      if (find_booking) {
        try {
          let create_charge = await Stripe.createCharge(
            find_booking.total_amount.toFixed(2) * 100,
            find_booking.stripe_customer_id,
            find_booking.card_id,
            find_booking.order_id,
            find_booking.provider_amount.toFixed(2) * 100,
            find_booking.provider_account_id
          );

          if (create_charge) {
            await ServiceBooking.update(
              {
                receipt: create_charge.receipt_url,
                transaction_id: create_charge.id,
                transfer_id: create_charge.transfer,
                payment_status: create_charge.status,
                request_status: "accepted",
              },
              {
                where: {
                  booking_id: req.params.id,
                },
              }
            );
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
                type: "service_response",
                id: find_booking.booking_id,
              };
              find_tokens.forEach((data) => {
                if (data.device_token !== "") {
                  tokens.push(data.device_token);
                }
              });
              console.log("tokens", tokens)

              await Fcm.createNotification(
                `Service accepted`,
                `${find_sender.full_name} accepted for your service request for ${find_service.name}`,
                3,
                find_sender.user_id,
                find_receiver.user_id,
                null,
                null,
                find_service.service_id,
                extra
              );
              if (tokens.length) {
                console.log('we are in  1')
                await Fcm.sendNotifications(
                  `Service accepted`,
                  `${find_sender.full_name} accepted for your service request for ${find_service.name}`,
                  "3",
                  tokens,
                  extra
                );
              }
            }
            return 1;
          }
        } catch (errors) {
          await ServiceBooking.update(
            {
              transaction_id: errors.charge,
              payment_status: "failed",
              request_status: "rejected",
            },
            {
              where: {
                booking_id: req.params.id,
              },
            }
          );
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
              id: find_booking.booking_id,
            };
            find_tokens.forEach((data) => {
              if (data.device_token !== "") {
                tokens.push(data.device_token);
              }
            });

            await Fcm.createNotification(
              `Service rejected`,
              `${find_service.name} service request rejected due to payment issue`,
              4,
              find_sender.user_id,
              find_receiver.user_id,
              null,
              null,
              find_service.service_id,
              extra
            );
            if (tokens.length) {
              console.log('we are in  2')
              await Fcm.sendNotifications(
                `Service rejected`,
                `${find_service.name} service request rejected due to payment issue`,
                "4",
                tokens,
                extra
              );
            }
          }
          console.log("hi");
          return errors;
        }
      } else {
        return 2;
      }
    } else if (req.body.response === "reject") {
      let update_status = await ServiceBooking.update(
        {
          request_status: "rejected",
        },
        {
          where: {
            booking_id: req.params.id,
          },
        }
      );
      if (find_receiver) {
        console.log("rec");
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
          id: find_booking.booking_id,
        };
        find_tokens.forEach((data) => {
          if (data.device_token !== "") {
            tokens.push(data.device_token);
          }
        });

        await Fcm.createNotification(
          `Service rejected`,
          `${find_sender.full_name} rejected your ${find_service.name} service request`,
          5,
          find_sender.user_id,
          find_receiver.user_id,
          null,
          null,
          find_service.service_id,
          extra
        );
        if (tokens.length) {
          console.log('we are in 3')
          await Fcm.sendNotifications(
            `Service rejected`,
            `${find_sender.full_name} rejected your ${find_service.name} service request`,
            "5",
            tokens,
            extra
          );
        }
      }
      if (update_status) {
        return 1;
      } else {
        return 2;
      }
    }
  },

  //list request

  async listRequest(req, res) {
    const offset = (req.body.page - 1) * constant.LIMIT;
    const limit = constant.LIMIT;
    try {

      let where = []

      if (req.body.category_id && JSON.parse(req.body.category_id).length > 0) {
        where.push({
          category_id: { [Op.in]: JSON.parse(req.body.category_id) }
        })
      }

      if (req.body.from_rate && req.body.to_rate) {
        where.push({
          rate: {
            [Op.between]: [
              parseFloat(req.body.from_rate),
              parseFloat(req.body.to_rate),
            ],
          }
        })
      }

      let find_requests = await ServiceBooking.findAndCountAll({
        where: {
          request_status: { [Op.eq]: "pending" },
          provider_id: req.user_id,
        },
        include: [
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
              "address",
              "latitude",
              "longitude"
            ],
          },
          {
            model: Event,
            as: "event",
            attributes: [
              "event_id",
              "user_id",
              "name",
              "address",
              "latitude",
              "longitude",
            ],
          },
          {
            model: Service,
            as: "service",
            where,
            required: where.length != 0,
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
            ]
          },
        ],
        attributes: [
          "booking_id",
          "order_id",
          "total_amount",
          "provider_amount",
          "customer_id",
          "service_id",
          "event_id",
          "request_status",
          "date",
          "start_time",
          "end_time",
          "hours",
          "commission",
          "createdAt",
        ],
        order: [["createdAt", "DESC"]],
        offset: offset,
        limit: limit,
      });
      find_requests.rows.map((element) => {
        if (element.customer.profile_image) {
          element.customer.profile_image =
            constant.AWS_S3_URL +
            constant.AWS_S3_PROJECT_FOLDER +
            constant.AWS_S3_USER_FOLDER +
            element.customer.profile_image;
        }
        if (element.service.image) {
          element.service.image =
            constant.AWS_S3_URL +
            constant.AWS_S3_PROJECT_FOLDER +
            constant.AWS_SERVICE_FOLDER +
            element.service.image;
        }
      });
      return find_requests;
    } catch (error) {
      throw error;
    }
  },

  //delete service

  async deleteService(req, res) {
    try {
      await Service.update(
        {
          is_deleted: true,
        },
        {
          where: {
            service_id: req.params.id,
          },
        }
      );
    } catch (error) {
      throw error;
    }
  },

  //list booking request
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
      if (type === "generic") {
        let whereGenericObj = {};
        if (user_type === "provider") {
          whereGenericObj.provider_id = req.user_id;
        } else {
          whereGenericObj.customer_id = req.user_id;
        }
        let find_upcoming_booking = await ServiceBooking.findAndCountAll({
          where: {
            ...whereGenericObj,
            request_status: "accepted",
            service_status: "pending",
            payment_status: "succeeded"
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
          order: [["createdAt", "DESC"]],
          offset: offset,
          limit: limit,
        });

        find_upcoming_booking.rows.map((result) => {
          //   //-service provider user image
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

        let find_past_booking = await ServiceBooking.findAndCountAll({
          where: {
            ...whereGenericObj,
            [Op.or]: [
              { service_status: "completed" },
              { request_status: "rejected" },
            ]
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
          order: [["createdAt", "DESC"]],
          offset: offset,
          limit: limit,
        });

        find_past_booking.rows.map((result) => {
          //   //-service provider user image
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

        let find_ongoing_booking = await ServiceBooking.findAndCountAll({
          where: {
            ...whereGenericObj,
            service_status: "started",
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
          order: [["createdAt", "DESC"]],
          offset: offset,
          limit: limit,
        });

        find_ongoing_booking.rows.map((result) => {
          //   //-service provider user image
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

        return {
          upcoming_booking: find_upcoming_booking,
          past_booking: find_past_booking,
          ongoing_booking: find_ongoing_booking
        }
      } else {


        let find_service_booking = await ServiceBooking.findAndCountAll({
          where: where_obj,
          include: [
            // {
            //   model: Event,
            //   as: "event",
            //   attributes: {
            //     exclude: ["updatedAt", "is_deleted"],
            //   },
            //   include: [
            //     {
            //       model: User,
            //       as: "user",
            //       attributes: [
            //         "user_id",
            //         "full_name",
            //         "email",
            //         "country_code",
            //         "phone_number",
            //         "profile_image",
            //       ],
            //     },
            //   ],
            // },
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
          order: [["createdAt", "DESC"]],
          offset: offset,
          limit: limit,
        });
        find_service_booking.rows.map((result) => {
          //   //- event provide user image
          //   if (result.event.user.profile_image) {
          //     result.event.user.profile_image =
          //       constant.AWS_S3_URL +
          //       constant.AWS_S3_PROJECT_FOLDER +
          //       constant.AWS_S3_USER_FOLDER +
          //       result.event.user.profile_image;
          //   } else {
          //     result.event.user.profile_image = null;
          //   }
          //   //-service image
          //   if (result.service.image) {
          //     result.service.image =
          //       constant.AWS_S3_URL +
          //       constant.AWS_S3_PROJECT_FOLDER +
          //       constant.AWS_SERVICE_FOLDER +
          //       result.service.image;
          //   } else {
          //     result.service.image = null;
          //   }

          //   //-service provider user image
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
      }
    } catch (error) {
      throw error;
    }
  },

  //update booking status
  async changeBookingStatus(req, res) {
    console.log("hi");
    let { status } = req.body;

    let update_status = ServiceBooking.update(
      {
        service_status: status,
      },
      {
        where: {
          booking_id: req.params.id,
        },
      }
    );
    return update_status;
  },

  async updateBillImage(req, res) {
    let update_bill_image = await ServiceBooking.update(
      {
        bill_image: req.body.image,
      },
      {
        where: {
          booking_id: req.params.id,
        },
      }
    );
    return update_bill_image;
  },

  async uploadRecentImages(req, res) {
    try {
      let { media_array } = req.body;
      media_array = JSON.parse(media_array).map((result) => {
        return { url: result, provider_id: req.user_id };
      });

      let upload_recent_media = await RecentWorkMedia.bulkCreate(media_array);
      return upload_recent_media;
    } catch (error) {
      throw error;
    }
  },
};
