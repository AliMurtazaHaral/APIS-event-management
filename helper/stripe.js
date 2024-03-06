const { STRIPE_CONFIGS } = require('../config/constant')
const stripe = require("stripe")(process.env.STRIPE_KEY);

module.exports = {
  async createProviderAccount(email) {
    return await stripe.accounts.create({
      type: "express",
      country: "US",
      email: email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });
  },

  async createCustomer(email, name) {
    const customer = await stripe.customers.create({
      email: email,
      name: name,
    });
    return customer;
  },

  async retriveAccount(account_id) {
    return await stripe.accounts.retrieve(account_id);
  },

  async getConnAccLink(account_id) {
    return await stripe.accounts.createLoginLink(account_id);
  },

  async createAccontLink(account_id, return_url, refresh_url) {
    return await stripe.accountLinks.create({
      account: account_id,
      refresh_url: refresh_url,
      return_url: return_url,
      type: "account_onboarding",
    });
  },

  async createCharge(total_amount, stripe_customer_id, card_id, order_id, provider_amount, provider_account_id) {
    let create_charge = await stripe.charges.create({
      amount: total_amount,
      customer: stripe_customer_id,
      currency: "usd",
      source: card_id,
      description: order_id,
      transfer_group: order_id,
      transfer_data: {
        amount: provider_amount,
        destination: provider_account_id,
      },
    });
    return create_charge
  },

  async createWebhook(reqBody, authHeader) {
    let event;

    try {
      event = await stripe.webhooks.constructEvent(reqBody, authHeader, STRIPE_CONFIGS.webHookSecretSign);

      switch (event.type) {
        case 'account.updated':
          const accountUpdated = event.data.object;
          console.log("updatedAccount: ", accountUpdated)
          return accountUpdated;
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
          return 0;
      }
    } catch (err) {
      console.log('error in webhook', err)
      return;
    }
  }
};
