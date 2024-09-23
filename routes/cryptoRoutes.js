const express = require("express");
const { fetchCryptoData } = require("../services/allcoins");

const router = express.Router();

router.get("/cryptocurrency/map", async (req, res) => {
  try {
    const data = await fetchCryptoData();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cryptocurrency data" });
  }
});

module.exports = router;