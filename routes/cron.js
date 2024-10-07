// export const cron = () => {
//     console.log("This is cron API");
//     saveCoinHistory();
//     console.log("This is cron after API");
//     res.status(200).json({ success: true });
// }
// const express = require('express');
// export default function handler(req, res) {
//     console.log("This is cron API");
//     saveCoinHistory();
//     console.log("This is cron after API");
//     res.status(200).end('Hello Cron!');
// }
const express = require('express');
const router = express.Router();

// Define your cron route
router.get('/save-coin-history', (req, res) => {
  console.log("This is cron API");
  saveCoinHistory();
  res.status(200).json({ success: true });
});

module.exports = router;

// module.exports = (req, res) => {
//     console.log("This is cron API");
//     saveCoinHistory();
//     console.log("This is cron after API");
//     res.status(200).json({ success: true });
//   };