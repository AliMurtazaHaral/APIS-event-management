/*
 * Summary:     event.services file for handling all event related actions.
 * Author:      Openxcell(empCode-496)
 */

/**require NPM-modules,models and constants for configuration */
const User = require("../../database/models").tbl_user;
const UserToken = require("../../database/models").tbl_user_token;
const Event = require("../../database/models").tbl_event;
const Cart = require("../../database/models").tbl_cart;
const Review = require("../../database/models").tbl_review;
const EventTicket = require("../../database/models").tbl_event_ticket;
const EventMedia = require("../../database/models").tbl_event_media;
const EventBooking = require("../../database/models").tbl_event_purchase;
const ServiceBooking = require("../../database/models").tbl_service_booking;
const Service = require("../../database/models").tbl_service;
const Category = require("../../database/models").tbl_category;
const Mail = require("../../helper/sendmail");
const FcmService = require("../../helper/fcm");
const Fcm = new FcmService();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const constant = require("../../config/constant");
const imageupload = require("../../middleware/multer_aws_upload");
const imageDelete = require("../../middleware/multer_aws_delete");
const random_string = require("../../helper/general.helper");
const Stripe = require("../../helper/stripe");

module.exports = {
  /* add */

  async add(req, res) {
    let {
      name,
      address,
      category_id,
      latitude,
      longitude,
      start_date,
      end_date,
      start_time,
      end_time,
      about,
      ticket_array,
      media,
    } = req.body;

    let add_event = await Event.create({
      user_id: req.user_id,
      name: name,
      address: address,
      category_id: category_id,
      latitude: latitude,
      longitude: longitude,
      start_date: start_date,
      end_date: end_date,
      start_time: start_time,
      end_time: end_time,
      about: about,
    });

    JSON.parse(ticket_array).forEach(async (element) => {
      await EventTicket.create({
        type: element.type,
        rate: element.rate,
        quantity: element.quantity,
        event_id: add_event.event_id,
      });
    });
    JSON.parse(media).forEach(async (element) => {
      await EventMedia.create({
        image: element,
        event_id: add_event.event_id,
      });
    });

    var subject = "Event on M.E.A";

    var find_user = await User.findOne({ where: { user_id: req.user_id } });
    var mailbody =
      "<div><p>Hello " +
      find_user.full_name +
      ",<p>" +
      "<p>Your " +
      add_event.name +
      "is added to M.E.A</p>" +
      "</div>";

    await Mail.sendmail(res, find_user.email, subject, mailbody);

    return add_event;
  },

  //list
  async list(req, res) {
    let { page, search, sort_by, order, category_id } = req.body;
    const offset = (page - 1) * constant.LIMIT;
    const limit = constant.LIMIT;
    search = search === undefined ? "" : search;
    order = order === undefined ? "DESC" : order;
    sort_by = sort_by === undefined ? "createdAt" : sort_by;
    let today_date = new Date();
    // let date = `${today_date.getFullYear()}-${today_date.getMonth()+1}-${today_date.getDate()}`
    // let time = `${today_date.getHours()}:${today_date.getMinutes()}:${today_date.getSeconds()}`
    // console.log("🚀 ~ file: event.services.js ~ line 91 ~ list ~ time", time)

    let where_obj = {
      where: Sequelize.where(
        Sequelize.literal(
          `6371 * acos(cos(radians(${req.body.latitude})) * cos(radians(latitude)) * cos(radians(${req.body.longitude}) - radians(longitude)) + sin(radians(${req.body.latitude})) * sin(radians(latitude)))`
        ),
        "<=",
        5000000
      ),
      // user_id: { [Op.ne]: req.user_id },
      is_deleted: false,
      is_stop_selling: false,
      start_date: {
        [Op.gte]: `${today_date.getFullYear()}-${today_date.getMonth() + 1
          }-${today_date.getDate()}`,
      },
      // start_time: { [Op.gte]: `${today_date.getHours()}:${today_date.getMinutes()}:${today_date.getSeconds()}` } ,
      [Op.or]: [
        {
          name: {
            [Op.like]: `%${search}%`,
          },
        },
      ],
    };
    if (category_id) {
      where_obj.category_id = { [Op.in]: JSON.parse(category_id) };
    }
    if (req.body.start_date) {
      where_obj.start_date = { [Op.gte]: req.body.start_date };
    }
    if (req.body.start_time) {
      where_obj.start_time = { [Op.gte]: req.body.start_time };
    }
    if (req.body.end_date) {
      where_obj.end_date = { [Op.lte]: req.body.end_date };
    }
    if (req.body.end_time) {
      where_obj.end_time = { [Op.lte]: req.body.end_time };
    }
    let find_event = await Event.findAndCountAll({
      where: where_obj,
      attributes: {
        exclude: ["updatedAt"],
      },
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
          model: EventMedia,
          as: "media",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
      distinct: true,
      order: [["createdAt", "DESC"]],
      offset: offset,
      limit: limit,
    });
    return find_event;
  },

  //view
  async viewById(req, res) {
    let find_event = await Event.findOne({
      where: {
        event_id: req.params.id,
      },
      attributes: {
        exclude: ["updatedAt", "is_deleted", "is_stop_selling"],
      },
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
          model: Category, as: "category", attributes: ["category_id", "category_name"]
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
            "stripe_account_id",
            "stripe_customer_id",
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
    });

    find_event.user.profile_image
      ? (find_event.user.profile_image =
        constant.AWS_S3_URL +
        constant.AWS_S3_PROJECT_FOLDER +
        constant.AWS_S3_USER_FOLDER +
        find_event.user.profile_image)
      : (find_event.user.profile_image = null);

    find_event.service_booked.forEach((element) => {
      //  -service image
      if (element.service.image) {
        element.service.image =
          constant.AWS_S3_URL +
          constant.AWS_S3_PROJECT_FOLDER +
          constant.AWS_SERVICE_FOLDER +
          element.service.image;
      } else {
        element.service.image = null;
      }

      //-service provider user image
      if (element.service.user.profile_image) {
        element.service.user.profile_image =
          constant.AWS_S3_URL +
          constant.AWS_S3_PROJECT_FOLDER +
          constant.AWS_S3_USER_FOLDER +
          element.service.user.profile_image;
      } else {
        element.service.user.profile_image = null;
      }
    });

    return find_event;
  },

  //view event purchase
  async viewEventPurchase(req, res) {
    let event_purchase_detail = await EventBooking.findOne({
      where: {
        purchase_id: req.params.id,
      },
      include: [
        {
          model: Event,
          as: "event",
          include: [
            {
              model: Category, as: "category", attributes: ["category_id", "category_name"]
            },
            {
              model: EventMedia,
              as: "media",
              attributes: ["event_media_id", "image"],
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
                "stripe_account_id",
                "stripe_customer_id",
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
          model: EventTicket,
          as: "event_ticket",
          attributes: ["event_ticket_id", "event_id", "type"],
        },
      ],
    });
    event_purchase_detail.event.user.profile_image
      ? (event_purchase_detail.event.user.profile_image =
        constant.AWS_S3_URL +
        constant.AWS_S3_PROJECT_FOLDER +
        constant.AWS_S3_USER_FOLDER +
        event_purchase_detail.event.user.profile_image)
      : (event_purchase_detail.event.user.profile_image = null);
    return event_purchase_detail;
  },

  //view service purchase
  async viewServicePurchase(req, res) {
    let service_purchase = await ServiceBooking.findOne({
      where: {
        booking_id: req.params.id,
      },
      include: [
        {
          model: Event,
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
            {
              model: Category,
              as: "parent_category",
              attributes: ["category_id", "category_name"],
            }
          ],
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
            "about"
          ],
        },
      ],
    });


    let find_review = await Review.count({
      where: {
        given_by_id: req.user_id,
        provider_id: service_purchase.provider_id,
      },
    });
    if (find_review) {
      service_purchase.dataValues.is_review_show = false
    } else {
      service_purchase.dataValues.is_review_show = true
    }
    if (service_purchase.service.user.profile_image) {
      service_purchase.service.user.profile_image =
        constant.AWS_S3_URL +
        constant.AWS_S3_PROJECT_FOLDER +
        constant.AWS_S3_USER_FOLDER +
        service_purchase.service.user.profile_image;
    } else {
      service_purchase.service.user.profile_image = null;
    }


    if (service_purchase.provider.profile_image) {
      service_purchase.provider.profile_image =
        constant.AWS_S3_URL +
        constant.AWS_S3_PROJECT_FOLDER +
        constant.AWS_S3_USER_FOLDER +
        service_purchase.provider.profile_image;
    } else {
      service_purchase.provider.profile_image = null;
    }

    if (service_purchase.service.image) {
      service_purchase.service.image =
        constant.AWS_S3_URL +
        constant.AWS_S3_PROJECT_FOLDER +
        constant.AWS_SERVICE_FOLDER +
        service_purchase.service.image;
    }

    return service_purchase;
  },

  //update
  async update(req, res) {
    let {
      name,
      address,
      category_id,
      latitude,
      longitude,
      start_date,
      end_date,
      start_time,
      end_time,
      about,
      ticket_array,
      delete_tickets,
      delete_media,
      delete_media_url,
      media,
    } = req.body;

    //update details

    let event_update = Event.update(
      {
        name: name,
        address: address,
        category_id: category_id,
        latitude: latitude,
        longitude: longitude,
        start_date: start_date,
        end_date: end_date,
        start_time: start_time,
        end_time: end_time,
        about: about,
      },
      {
        where: {
          event_id: req.params.id,
        },
      }
    );

    //tickets logic

    if (ticket_array) {
      JSON.parse(ticket_array).length &&
        JSON.parse(ticket_array).forEach(async (result) => {
          if (result.event_ticket_id) {
            await EventTicket.update(
              {
                type: result.type,
                quantity: result.quantity,
                rate: result.rate,
              },
              {
                where: {
                  event_ticket_id: result.event_ticket_id,
                },
              }
            );
          } else {
            await EventTicket.create({
              type: result.type,
              quantity: result.quantity,
              rate: result.rate,
              event_id: req.params.id,
            });
          }
        });
    }

    //add image

    if (media) {
      JSON.parse(media).length &&
        JSON.parse(media).forEach(async (element) => {
          await EventMedia.create({
            image: element,
            event_id: req.params.id,
          });
        });
    }

    //delete tickets

    if (delete_tickets) {
      JSON.parse(delete_tickets).length &&
        JSON.parse(delete_tickets).forEach(async (element) => {
          await EventTicket.update(
            {
              is_deleted: true,
            },
            {
              where: { event_ticket_id: element },
            }
          );
        });
    }

    //delete media

    if (delete_media) {
      await EventMedia.destroy({
        where: {
          event_media_id: { [Op.in]: JSON.parse(delete_media) },
        },
      });

      if (JSON.parse(delete_media_url).length) {
        JSON.parse(delete_media_url).forEach((res) => {
          imageDelete(res);
        });
      }
    }
    return event_update;
  },

  //stop selling
  async stopSelling(req, res) {
    let stop_selling = await Event.update(
      {
        is_stop_selling: true,
      },
      {
        where: {
          event_id: req.params.id,
        },
      }
    );
    return stop_selling;
  },

  //check event sold
  async checkTicketSold(req, res) {
    try {
      var count = 0;
      var find_event = await EventBooking.count({
        where: {
          event_id: req.params.id,
          payment_status: "succeeded",
        },
      });
      var find_service_booked = await ServiceBooking.count({
        where: {
          event_id: req.params.id,
          payment_status: "succeeded",
          request_status: "accepted",
        },
      });
      count += find_event;
      count += find_service_booked;
      console.log(count);
      return count;
    } catch (error) { }
  },

  //buy event
  async buyEvent(req, res) {
    try {
      let order_id = "#EORDER_" + random_string.generateRandomString(5);

      let {
        total_amount,
        stripe_customer_id,
        card_id,
        provider_amount,
        provider_account_id,
        provider_id,
        event_id,
        event_ticket_id,
        ticket,
        commission,
        cart_id,
        is_free,
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
        event_ticket_id: event_ticket_id,
        ticket: ticket,
        event_id: event_id,
        commission: commission,
        payment_status: parseInt(is_free) ? "succeeded" : null,
      };

      let find_event_avaibility = await EventTicket.findOne({
        where: {
          event_ticket_id: event_ticket_id,
        },
      });
      console.log(find_event_avaibility.quantity - find_event_avaibility.sold);
      if (find_event_avaibility.quantity - find_event_avaibility.sold > 0) {
        console.log("hi");
        let create_order = await EventBooking.create(order_obj);
        console.log("hi1");

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
          var find_event = await Event.findOne({
            where: {
              event_id: event_id,
            },
            attributes: ["event_id", "name"],
          });

          if (parseInt(is_free)) {
            let find_ticket = await EventTicket.findOne({
              where: {
                event_ticket_id: event_ticket_id,
              },
            });

            await EventTicket.update(
              {
                sold: find_ticket.sold + parseInt(ticket),
              },
              {
                where: {
                  event_ticket_id: event_ticket_id,
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
                type: "event_booking",
                id: create_order.purchase_id,
              };
              find_tokens.forEach((data) => {
                tokens.push(data.device_token);
              });

              await Fcm.createNotification(
                `${ticket == 1 ? "Ticket" : "Tickets"} purchased`,
                // `${find_sender.full_name} purchased ${ticket} ${
                //   find_event_avaibility.type
                // } free ${ticket == 1 ? "Ticket" : "Tickets"} for your event ${
                //   find_event.name
                // }`,
                `${ticket}`,
                1,
                find_sender.user_id,
                find_receiver.user_id,
                find_event.event_id,
                find_event_avaibility.event_ticket_id,
                null,
                extra
              );
              if (tokens.length) {
                await Fcm.sendNotifications(
                  `${ticket == 1 ? "Ticket" : "Tickets"} purchased`,
                  `${find_sender.full_name} purchased ${ticket} ${find_event_avaibility.type
                  } free ${ticket == 1 ? "Ticket" : "Tickets"} for your event ${find_event.name
                  }`,
                  "1",
                  tokens,
                  extra
                );
              }
            }

            return 1;
          } else {
            try {
              let create_charge = await Stripe.createCharge(
                parseFloat(total_amount).toFixed(2) * 100,
                stripe_customer_id,
                card_id,
                order_id,
                parseFloat(provider_amount).toFixed(2) * 100,
                provider_account_id
              );

              if (create_charge) {
                await EventBooking.update(
                  {
                    receipt: create_charge.receipt_url,
                    transaction_id: create_charge.id,
                    transfer_id: create_charge.transfer,
                    payment_status: create_charge.status,
                  },
                  {
                    where: {
                      order_id: order_id,
                    },
                  }
                );
                let find_ticket = await EventTicket.findOne({
                  where: {
                    event_ticket_id: event_ticket_id,
                  },
                });

                await EventTicket.update(
                  {
                    sold: find_ticket.sold + parseInt(ticket),
                  },
                  {
                    where: {
                      event_ticket_id: event_ticket_id,
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
                    type: "event_booking",
                    id: create_order.purchase_id,
                  };
                  find_tokens.forEach((data) => {
                    tokens.push(data.device_token);
                  });
                  await Fcm.createNotification(
                    `${ticket == 1 ? "Ticket" : "Tickets"} purchased`,
                    // `${find_sender.full_name} purchased ${ticket} ${
                    //   find_event_avaibility.type
                    // } free ${ticket == 1 ? "Ticket" : "Tickets"} for your event ${
                    //   find_event.name
                    // }`,
                    `${ticket}`,
                    1,
                    find_sender.user_id,
                    find_receiver.user_id,
                    find_event.event_id,
                    find_event_avaibility.event_ticket_id,
                    null,
                    extra
                  );
                  if (tokens.length) {
                    Fcm.sendNotifications(
                      `${ticket == 1 ? "Ticket" : "Tickets"} purchased`,
                      `${find_sender.full_name} purchased ${ticket} ${find_event_avaibility.type
                      } ${ticket == 1 ? "Ticket" : "Tickets"} for your event ${find_event.name
                      }`,
                      "1",
                      tokens,
                      extra
                    );
                  }
                }
                return 1;
              }
            } catch (errors) {
              await EventBooking.update(
                {
                  transaction_id: errors.charge,
                  payment_status: "failed",
                },
                {
                  where: {
                    order_id: order_id,
                  },
                }
              );
              return errors;
            }
          }
        } else {
          return 2;
        }
      } else {
        return 3;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  //list my event
  async listMyEvent(req, res) {
    console.log("hi", req.user_id);
    let { page, search } = req.body;
    const offset = (page - 1) * constant.LIMIT;
    const limit = constant.LIMIT;
    search = search === undefined ? "" : search;
    let today = new Date();
    let date = `${today.getFullYear()}-${today.getMonth() + 1
      }-${today.getDate()}`;
    if (req.body.type === "buy_event") {
      let find_buy_events = await EventBooking.findAndCountAll({
        where: {
          customer_id: req.user_id,
          payment_status: "succeeded",
          "$event.start_date$": { [Op.gte]: date },
          [Op.or]: [
            {
              "$event.name$": {
                [Op.like]: `%${search}%`,
              },
            },
          ],
        },
        subQuery: false,
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
        order: [["createdAt", "DESC"]],
        offset: offset,
        limit: limit,
      });
      return find_buy_events;
    }
    if (req.body.type === "sell_event") {
      let find_sell_events = await Event.findAndCountAll({
        where: {
          user_id: req.user_id,
          end_date: { [Op.gte]: date },
          is_deleted: false,
          [Op.or]: [
            {
              name: {
                [Op.like]: `%${search}%`,
              },
            },
          ],
        },
        include: [
          {
            model: EventTicket,
            as: "tickets",
            attributes: { exclude: ["createdAt", "updatedAt", "event_id"] },
          },
          {
            model: EventMedia,
            as: "media",
            attributes: ["event_media_id", "image"],
          },
        ],
        distinct: true,
        order: [["createdAt", "DESC"]],
        offset: offset,
        limit: limit,
      });
      return find_sell_events;
    }
    if (req.body.type === "past") {
      let data = {};
      let past_tickets = [];

      let past_sell = await Event.findAll({
        where: {
          user_id: req.user_id,
          end_date: { [Op.lt]: date },
          is_deleted: false,
          [Op.or]: [
            {
              name: {
                [Op.like]: `%${search}%`,
              },
            },
          ],
        },
        include: [
          {
            model: EventTicket,
            as: "tickets",
            attributes: { exclude: ["createdAt", "updatedAt", "event_id"] },
          },
          {
            model: EventMedia,
            as: "media",
            attributes: ["event_media_id", "image"],
          },
        ],
        distinct: true,
        order: [["createdAt", "DESC"]],
        // offset: offset,
        // limit: limit,
      });
      let past_buy = await EventBooking.findAll({
        where: {
          customer_id: req.user_id,
          payment_status: "succeeded",
          "$event.end_date$": { [Op.lt]: date },
          [Op.or]: [
            {
              "$event.name$": {
                [Op.like]: `%${search}%`,
              },
            },
          ],
        },
        subQuery: false,
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
        order: [["createdAt", "DESC"]],
        // offset: offset,
        // limit: limit,
      });
      // past_tickets.sell=past_sell
      // past_tickets.buy=past_buy

      past_sell.forEach((result, i) => {
        result.dataValues.type = "sell";
        past_tickets.push(result);
      });
      past_buy.forEach((result1, i) => {
        result1.dataValues.type = "buy";
        past_tickets.push(result1);
      });
      past_tickets.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      );
      data.count = past_tickets.length;
      data.event = past_tickets;
      return data;
    }
    if (req.body.type === 'generic') {
      let find_buy_events = await EventBooking.findAndCountAll({
        where: {
          customer_id: req.user_id,
          payment_status: "succeeded",
          "$event.end_date$": { [Op.gte]: date },
          [Op.or]: [
            {
              "$event.name$": {
                [Op.like]: `%${search}%`,
              },
            },
          ],
        },
        subQuery: false,
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
        order: [["createdAt", "DESC"]],
        limit: limit,
        offset: offset
      });

      let find_sell_events = await Event.findAndCountAll({
        where: {
          user_id: req.user_id,
          end_date: { [Op.gte]: date },
          is_deleted: false,
          [Op.or]: [
            {
              name: {
                [Op.like]: `%${search}%`,
              },
            },
          ],
        },
        include: [
          {
            model: EventTicket,
            as: "tickets",
            attributes: { exclude: ["createdAt", "updatedAt", "event_id"] },
          },
          {
            model: EventMedia,
            as: "media",
            attributes: ["event_media_id", "image"],
          },
        ],
        distinct: true,
        order: [["createdAt", "DESC"]],
        limit: limit,
        offset: offset
      });

      let data = {};
      let past_tickets = [];

      let past_sell = await Event.findAll({
        where: {
          user_id: req.user_id,
          end_date: { [Op.lt]: date },
          is_deleted: false,
          [Op.or]: [
            {
              name: {
                [Op.like]: `%${search}%`,
              },
            },
          ],
        },
        include: [
          {
            model: EventTicket,
            as: "tickets",
            attributes: { exclude: ["createdAt", "updatedAt", "event_id"] },
          },
          {
            model: EventMedia,
            as: "media",
            attributes: ["event_media_id", "image"],
          },
        ],
        distinct: true,
        order: [["createdAt", "DESC"]],
        // offset: offset,
        // limit: limit,
      });

      let past_buy = await EventBooking.findAll({
        where: {
          customer_id: req.user_id,
          payment_status: "succeeded",
          "$event.end_date$": { [Op.lt]: date },
          [Op.or]: [
            {
              "$event.name$": {
                [Op.like]: `%${search}%`,
              },
            },
          ],
        },
        subQuery: false,
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
        order: [["createdAt", "DESC"]],
        // offset: offset,
        // limit: limit,
      });

      past_sell.forEach((result, i) => {
        result.dataValues.type = "sell";
        past_tickets.push(result);
      });
      past_buy.forEach((result1, i) => {
        result1.dataValues.type = "buy";
        past_tickets.push(result1);
      });
      past_tickets.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      );
      data.count = past_tickets.length;
      data.rows = past_tickets;

      return {
        buyData: find_buy_events,
        sellData: find_sell_events,
        pastData: data
      }

    }
  },
};
