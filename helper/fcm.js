var fcm = require("fcm-notification");
var key = require("./event.json");
var FCM = new fcm(key);
const Notification = require("../database/models").tbl_notification;

class FCMService {
  async sendNotifications(
    title,
    body,
    notificationType,
    tokens,
    data,
    receiver_id
  ) {
    // let badges = await Notification.count({
    //   where: {
    //     receiver_id: receiver_id,
    //     is_read: false,
    //   },
    // });

    // let click_action = "FLUTTER_NOTIFICATION_CLICK";
    const apns = {
      payload: {
        aps: {
          sound: "default",
        },
      },
    };

    var message = {
      notification: { title: title, body: body },
      data: {
        // click_action: click_action,
        notification_type: notificationType,
        data: JSON.stringify(data),
      },
      apns,
    };
    console.log("FCMService -> message", message);

    return FCM.sendToMultipleToken(message, tokens, function (err, response) {
      if (err) {
        console.log("1", err);
        return err;
      } else {
        console.log("2", response);
        return response;
      }
    });
  }

  async createNotification(
    title,
    body,
    notification_type,
    sender_id,
    receiver_id,
    event_id,
    event_ticket_id,
    service_id,
    data
  ) {
    var message = {
      notification: { title: title, body: body },
      data: {
        notification_type: notification_type,
        data: JSON.stringify(data),
      },
    };

    let notification_data = {
      message: JSON.stringify(message),
      sender_id: sender_id,
      receiver_id: receiver_id,
      notification_type: notification_type,
      event_id: event_id ? event_id : null,
      event_ticket_id: event_ticket_id ? event_ticket_id : null,
      service_id: service_id ? service_id : null,
    };
    await Notification.create(notification_data);
  }
}

module.exports = FCMService;
