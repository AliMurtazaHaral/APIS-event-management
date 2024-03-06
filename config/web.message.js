/*
 * Summary:     webMessages file for response messages
 * Author:      Openxcell(empCode-496)
 */
const appMessage = {

  SUCCESS: "Success",
  INTERNALSERVERERROR:"Internal server error",

  SOMETHINGMISSING:"Something missing",

  //USER MESSAGES
  SIGNUPSUCCESS: "Check your inbox to verify your email",
  USERALREADYEXIST: "User already exist",
  ALREADYVERIFY: "Account is already verified",
  VERIFIED: "Your email has been verified successfully",
  PLANPURCHASED: "Plan purchased",
  USERNOT_FOUND: "Credentials doesn't exist.",
  EMAILVERIFICATINPENDING:"Check your inbox to verify your mail",
  LOGINSUCCESS: "Login successfully",
  LOGOUTSUCCESFULLY:"Logout successfully",
  SETPASSWORD:"Please set your password from forgot password",
  INCORRECT_PASSWORD:"Incorrect password",
  EMAILSENT:"Email sent succesfully",
  PASSWORDCHANGED:"Password changed succesfully",
  CURRENTPASSINC:"Current password is incorrect",
  //profile messages

  PROFILEPENDING: "Your profile approval is pending",
  PROFILEREJECTED: "Your profile is rejected",
  PROFILEINACTIVE:"Your profile is inactive",
  PROFILEUPDATED:"Your profile is updated",
  PROFILENOTUPDATED:"Your profile is not updated",
  TOKENNOTMATCHED:"Token not matched",
  TOKENREQUIRED:"Token Required",
  PLANVALIDE:"Plan is valid",
  PLANEXPIRED:"Plan expired",
  NORECORDFOUND: "No record found",


  //event related message
  EVENTADDED:"Event added succesfully.",
  EVENTUPDATED:"Event updated.",
  OUTOFSTOCK:"Requested quantity of tickets is not available",
  TICKETSPURCHASED:"Tickets purchased succesfully",
  TICKETSORSERVICEPURCHASED:"Event purchased or service booked",

  //service messages
  SERVICEADDED:"Service added",
  NOT_FOUND:"Not found",
  DETAILSREQUIRED:"Details Required",
  SERVICEBOOKED:"Service booked",
  PAYMENTFAILED:"Payment failed",
  PAYMENTSUCCESSFUL:"Payment successful",
  STRIPEERROR:"Stripe error",
  //webhook message
  LINKEXPIRE:"Link is expire",
  REDIRECTURL:"Redirect url",
  UPDATED:"Updated"
};

module.exports = {
  appMessage,
};
