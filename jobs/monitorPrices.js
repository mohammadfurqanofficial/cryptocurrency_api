const Coin = require("../models/Coin"); // Assuming you have a Coin model for coin data
const Alert = require("../models/Alert");
const sendEmail = require("../utils/sendEmail"); // Utility function for sending email

async function monitorPrices() {
  const alerts = await Alert.find(); // Fetch all alerts

  for (const alert of alerts) {
    const coin = await Coin.findOne({ id: alert.coinId });

    if (coin) {
      if (
        coin.price >= alert.priceThreshold ||
        coin.volume_24h >= alert.volumeThreshold
      ) {
        // Send email to user
        const userEmail = await getUserEmail(alert.userId); // Assuming a function to fetch user email
        sendEmail(
          userEmail,
          "Coin Alert",
          `The coin ${coin.name} has met your alert criteria: Price: ${coin.price}, Volume: ${coin.volume_24h}.`
        );
      }
    }
  }
}

module.exports = { monitorPrices };
