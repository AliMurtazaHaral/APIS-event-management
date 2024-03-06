/*
 * Summary:     common.controller file for handling all requests and response of Common
 * Author:      Openxcell(empCode-496)
 */

/*Messages,status code and services require*/
const status = require("../../config/status").status;
const message = require("../../config/web.message").appMessage;
const common_service = require("../../services/app/common.service");
const path = require("path");
const ejs = require("ejs");

module.exports = {
  /* signup */

  async signup(req, res) {
    try {
      let user = await common_service.signup(req, res);
      if (user === 1) {
        res.status(status.SUCCESS_STATUS).send({
          data: {},
          message: message.USERALREADYEXIST,
          status: status.ERROR,
        });
      } else {
        res.status(status.SUCCESS_STATUS).send({
          data: {},
          message: message.SIGNUPSUCCESS,
          status: status.SUCCESS,
        });
      }
      //response of add category And Sub-category
    } catch (error) {
      console.log('error ', error)
      //response on internal server error
      res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
        error: error,
        data: {},
        message: message.INTERNALSERVERERROR,
        status: status.ERROR,
      });
    }
  },

  /* forgot password */

  async forgotPassword(req, res) {
    try {
      let user = await common_service.forgotPassword(req, res);
      if (user === 1) {
        res.status(status.SUCCESS_STATUS).send({
          data: {},
          message: message.USERNOT_FOUND,
          status: status.ERROR,
        });
      } else {
        res.status(status.SUCCESS_STATUS).send({
          data: {},
          message: message.EMAILSENT,
          status: status.SUCCESS,
        });
      }
      //response of add category And Sub-category
    } catch (error) {
      console.log("🚀 ~ file: common.controller.js ~ line 66 ~ forgotPassword ~ error", error)

      //response on internal server error
      res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
        error: error,
        data: {},
        message: message.INTERNALSERVERERROR,
        status: status.ERROR,
      });
    }
  },

  //reset password
  async resetPassword(req, res) {
    try {
      let user = await common_service.resetPassword(req, res);
      if (user === 2) {
        res.status(status.SUCCESS_STATUS).send({
          data: {},
          message: message.LINKEXPIRE,
          status: status.ERROR,
        });
      } else {
        res.status(status.SUCCESS_STATUS).send({
          data: {},
          message: message.PASSWORDCHANGED,
          status: status.SUCCESS,
        });
      }
      //response of add category And Sub-category
    } catch (error) {
      console.log("🚀 ~ file: common.controller.js ~ line 66 ~ forgotPassword ~ error", error)

      //response on internal server error
      res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
        error: error,
        data: {},
        message: message.INTERNALSERVERERROR,
        status: status.ERROR,
      });
    }
  },

  /* email verification */

  async emailVerification({ params }, res) {
    try {
      let email_verify_res = await common_service.emailVerification(params);
      let reqPath = path.join(__dirname, "../../helper/email_verification.ejs");
      let TITLE = "Event App";
      if (email_verify_res === 1) {
        let MESSAGE = message.ALREADYVERIFY;
        ejs.renderFile(reqPath, { TITLE, MESSAGE }, function (err, data) {
          res.end(data);
        });
      }
      let MESSAGE = message.VERIFIED;
      ejs.renderFile(reqPath, { TITLE, MESSAGE }, function (err, data) {
        res.end(data);
      });
    } catch (error) {
      res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
        data: [],
        message: message.INTERNALSERVERERROR,
        status: status.ERROR,
      });
    }
  },

  /* plan purchase */

  async planPurchase(req, res) {
    try {
      let user = await common_service.planPurchase(req, res);
      if (user === 0) {
        res.status(status.SUCCESS_STATUS).send({
          data: [],
          message: message.SOMETHINGMISSING,
          status: status.ERROR,
        });
      } else {
        res.status(status.SUCCESS_STATUS).send({
          data: [],
          message: message.PLANPURCHASED,
          status: status.SUCCESS,
        });
      }
      //response of purchase plan
    } catch (error) {
      //response on internal server error
      res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
        data: [],
        message: message.INTERNALSERVERERROR,
        status: status.ERROR,
      });
    }
  },

  /* login */

  async login(req, res) {
    try {
      let user = await common_service.login(req, res);
      if (user === 1) {
        res.status(status.SUCCESS_STATUS).send({
          data: {},
          message: message.USERNOT_FOUND,
          status: status.ERROR,
        });
      } else if (user === 2) {
        res.status(status.SUCCESS_STATUS).send({
          data: {},
          message: message.PROFILEINACTIVE,
          status: status.ERROR,
        });
      } else if (user === 3) {
        res.status(status.SUCCESS_STATUS).send({
          data: {},
          message: message.EMAILVERIFICATINPENDING,
          status: status.ERROR,
        });
      } else if (user === 4) {
        res.status(status.SUCCESS_STATUS).send({
          data: {},
          message: message.PROFILEPENDING,
          status: status.ERROR,
        });
      } else if (user === 5) {
        res.status(status.SUCCESS_STATUS).send({
          data: {},
          message: message.PROFILEREJECTED,
          status: status.ERROR,
        });
      } else if (user === 6) {
        res.status(status.SUCCESS_STATUS).send({
          data: {},
          message: message.SETPASSWORD,
          status: status.ERROR,
        });
      } else if (user === 7) {
        res.status(status.SUCCESS_STATUS).send({
          data: {},
          message: message.INCORRECT_PASSWORD,
          status: status.ERROR,
        });
      } else {
        res.status(status.SUCCESS_STATUS).send({
          data: user,
          message: message.LOGINSUCCESS,
          status: status.SUCCESS,
        });
      }
    } catch (error) {
      console.log(
        "🚀 ~ file: common.controller.js ~ line 152 ~ login ~ error",
        error
      );

      //response on internal server error
      res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
        data: [],
        message: message.INTERNALSERVERERROR,
        status: status.ERROR,
      });
    }
  },

  /* check plan validity */

  async planValidity(req, res) {
    try {
      let user = await common_service.planValidity(req, res);
      if (user) {
        res.status(status.SUCCESS_STATUS).send({
          data: user,
          message: message.PLANVALIDE,
          status: status.SUCCESS,
        });
      } else {
        res.status(status.SUCCESS_STATUS).send({
          data: {},
          message: message.PLANEXPIRED,
          status: status.ERROR,
        });
      }
      //response of purchase plan
    } catch (error) {
      //response on internal server error
      res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
        data: [],
        message: message.INTERNALSERVERERROR,
        status: status.ERROR,
      });
    }
  },

  /* user get by id */

  async viewById(req, res) {
    try {
      let user = await common_service.viewById(req, res);
      if (user) {
        res.status(status.SUCCESS_STATUS).send({
          data: user,
          message: message.SUCCESS,
          status: status.SUCCESS,
        });
      } else {
        res.status(status.SUCCESS_STATUS).send({
          data: {},
          message: message.NOT_FOUND,
          status: status.ERROR,
        });
      }
      //response of purchase plan
    } catch (error) {
      //response on internal server error
      res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
        data: [],
        message: message.INTERNALSERVERERROR,
        status: status.ERROR,
      });
    }
  },


  /* user get by token */

  async viewByToken(req, res) {
    try {
      let user = await common_service.viewByToken(req, res);
      if (user) {
        res.status(status.SUCCESS_STATUS).send({
          data: user,
          message: message.SUCCESS,
          status: status.SUCCESS,
        });
      } else {
        res.status(status.SUCCESS_STATUS).send({
          data: {},
          message: message.NOT_FOUND,
          status: status.ERROR,
        });
      }
      //response of purchase plan
    } catch (error) {
      //response on internal server error
      console.log("🚀 ~ file: common.controller.js ~ line 312 ~ viewByToken ~ error", error)

      res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
        data: [],
        message: message.INTERNALSERVERERROR,
        status: status.ERROR,
      });
    }
  },

  async updateUserVerification(req, res) {
    let user_update = await common_service.updateUserVerification(req, res);
    res.status(status.SUCCESS_STATUS).send({
      data: user_update,
      message: message.PROFILEUPDATED,
      status: status.SUCCESS,
    });
  },

  /* update user */

  async updateProfile(req, res) {
    try {
      let user_update = await common_service.updateProfile(req, res);
      if (user_update) {
        res.status(status.SUCCESS_STATUS).send({
          data: user_update,
          message: message.PROFILEUPDATED,
          status: status.SUCCESS,
        });
      } else {
        res.status(status.SUCCESS_STATUS).send({
          data: [],
          message: message.PROFILENOTUPDATED,
          status: status.SUCCESS,
        });
      }

      //response of purchase plan
    } catch (error) {
      //response on internal server error
      res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
        data: [],
        message: message.INTERNALSERVERERROR,
        status: status.ERROR,
      });
    }
  },

  /* update bank details */

  async updateBankDetail(req, res) {
    try {
      let bankdetail_update = await common_service.updateBankDetail(req, res);
      if (bankdetail_update) {
        res.status(status.SUCCESS_STATUS).send({
          data: [],
          message: message.PROFILEUPDATED,
          status: status.SUCCESS,
        });
      } else {
        res.status(status.SUCCESS_STATUS).send({
          data: [],
          message: message.PROFILENOTUPDATED,
          status: status.SUCCESS,
        });
      }

      //response of purchase plan
    } catch (error) {
      //response on internal server error
      res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
        data: [],
        message: message.INTERNALSERVERERROR,
        status: status.ERROR,
      });
    }
  },

  /* contact us */

  async contactUs(req, res) {
    try {
      await common_service.contactUs(req, res);

      res.status(status.SUCCESS_STATUS).send({
        data: [],
        message: message.SUCCESS,
        status: status.SUCCESS,
      });
    } catch (error) {
      //response on internal server error
      res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
        data: [],
        message: message.INTERNALSERVERERROR,
        status: status.ERROR,
      });
    }
  },

  /* logout */

  async logout(req, res) {
    try {
      await common_service.logout(req, res);

      res.status(status.SUCCESS_STATUS).send({
        data: [],
        message: message.LOGOUTSUCCESFULLY,
        status: status.SUCCESS,
      });
    } catch (error) {
      //response on internal server error
      res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
        data: [],
        message: message.INTERNALSERVERERROR,
        status: status.ERROR,
      });
    }
  },

  /* static pages */

  async staticPages(req, res) {
    try {
      let content = await common_service.staticPages(req, res);
      res.status(status.SUCCESS_STATUS).send({
        data: content,
        message: message.SUCCESS,
        status: status.SUCCESS,
      });
    } catch (error) {
      //response on internal server error
      res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
        data: [],
        message: message.INTERNALSERVERERROR,
        status: status.ERROR,
      });
    }
  },

  async setting(req, res) {
    try {
      let setting = await common_service.setting(req, res);
      res.status(status.SUCCESS_STATUS).send({
        data: setting,
        message: message.SUCCESS,
        status: status.SUCCESS,
      });
    } catch (error) {
      //response on internal server error
      res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
        data: [],
        message: message.INTERNALSERVERERROR,
        status: status.ERROR,
      });
    }
  },


  async addReview(req, res) {
    try {
      let add_review = await common_service.addReview(req, res);
      if (add_review) {
        res.status(status.SUCCESS_STATUS).send({
          data: {},
          message: message.SUCCESS,
          status: status.SUCCESS,
        });
      } else {
        res.status(status.SUCCESS_STATUS).send({
          data: {},
          message: message.DETAILSREQUIRED,
          status: status.SUCCESS,
        });
      }
    } catch (error) {
      //response on internal server error
      res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
        data: [],
        message: message.INTERNALSERVERERROR,
        status: status.ERROR,
      });
    }
  },

  async changePassword(req, res) {
    try {
      let change_password = await common_service.changePassword(req, res);
      if (change_password) {
        res.status(status.SUCCESS_STATUS).send({
          data: {},
          message: message.PASSWORDCHANGED,
          status: status.SUCCESS,
        });
      } else {
        res.status(status.SUCCESS_STATUS).send({
          data: {},
          message: message.CURRENTPASSINC,
          status: status.ERROR,
        });
      }
    } catch (error) {
      //response on internal server error
      res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
        data: [],
        message: message.INTERNALSERVERERROR,
        status: status.ERROR,
      });
    }
  },


  async earning(req, res) {
    try {
      let find_earning = await common_service.earning(req, res);
      res.status(status.SUCCESS_STATUS).send({
        data: find_earning,
        message: message.SUCCESS,
        status: status.SUCCESS,
      });
    } catch (error) {
      console.log("🚀 ~ file: common.controller.js ~ line 443 ~ earningTransaction ~ error", error)

      //response on internal server error
      res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
        data: [],
        message: message.INTERNALSERVERERROR,
        status: status.ERROR,
      });
    }
  },

  async transaction(req, res) {
    try {
      let find_transaction = await common_service.transaction(req, res);
      res.status(status.SUCCESS_STATUS).send({
        data: find_transaction,
        message: message.SUCCESS,
        status: status.SUCCESS,
      });
    } catch (error) {
      console.log("🚀 ~ file: common.controller.js ~ line 443 ~ earningTransaction ~ error", error)

      //response on internal server error
      res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
        data: [],
        message: message.INTERNALSERVERERROR,
        status: status.ERROR,
      });
    }
  },

  async notificationList(req, res) {
    try {
      let notification_list = await common_service.notificationList(req, res);
      res.status(status.SUCCESS_STATUS).send({
        data: notification_list,
        message: message.SUCCESS,
        status: status.SUCCESS,
      });
    } catch (error) {
      //response on internal server error
      res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
        data: [],
        message: message.INTERNALSERVERERROR,
        status: status.ERROR,
      });
    }
  },

  async notificationStatusChange(req, res) {
    try {
      await common_service.notificationStatusChange(req, res);
      res.status(status.SUCCESS_STATUS).send({
        data: [],
        message: message.SUCCESS,
        status: status.SUCCESS,
      });
    } catch (error) {
      //response on internal server error
      res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
        data: [],
        message: message.INTERNALSERVERERROR,
        status: status.ERROR,
      });
    }
  },

  async reviewList(req, res) {
    try {
      var review_list = await common_service.reviewList(req, res);
      res.status(status.SUCCESS_STATUS).send({
        data: review_list,
        message: message.SUCCESS,
        status: status.SUCCESS,
      });
    } catch (error) {
      console.log("🚀 ~ file: common.controller.js ~ line 600 ~ reviewList ~ error", error)

      //response on internal server error
      res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
        data: [],
        message: message.INTERNALSERVERERROR,
        status: status.ERROR,
      });
    }
  },

  async postMailToClient(req, res) {
    try {
      const sendMailToClient = await common_service.postMailToClient(req, res);
      if (sendMailToClient === 0) {
        return res.status(401).send({
          message: "Unable to send the mail to the client",
          status: status.ERROR
        })
      } else {
        return res.status(200).send({
          message: "Mail sent successfully to the client",
          status: status.SUCCESS
        })
      }
    } catch (e) {
      console.log("error", e);
      res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
        data: [],
        message: message.INTERNALSERVERERROR,
        status: status.ERROR,
      });
    }
  },

  async deleteUserAccountAndDetails(req, res) {
    try {
      const deleteUser = await common_service.deleteUserAccountAndDetails(req, res);
      if (deleteUser === 1) {
        return res.status(400).send({
          message: "Missing email or password.",
          data: {},
          status: status.ERROR
        })
      } else if (deleteUser === 2) {
        return res.status(400).send({
          message: "User not found.",
          data: {},
          status: status.ERROR
        })
      } else if (deleteUser === 3) {
        return res.status(400).send({
          message: "Credentials does'nt match.",
          data: {},
          status: status.ERROR
        })
      } else if (deleteUser === 5) {
        return res.status(400).send({
          message: "Unable to delete the user, Try again!",
          data: {},
          status: status.ERROR
        })
      } else {
        return res.status(200).send({
          message: "User deleted successfully",
          data: {},
          status: status.SUCCESS
        })
      }
    } catch (error) {
      console.log("error", error);
      res.status(status.INTERNAL_SERVER_ERROR_STATUS).send({
        data: {},
        message: message.INTERNALSERVERERROR,
        status: status.ERROR,
      });
    }
  }
};
