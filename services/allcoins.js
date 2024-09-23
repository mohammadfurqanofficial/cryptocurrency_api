import axios from "axios";

const COINMARKETCAP_API_KEY = "b1001b25-6fdb-4927-94b4-ade8d6e1effd"; // Your API key

export const fetchCryptoData = async () => {
  try {
    const response = await axios.get(
      "https://pro-api.coinmarketcap.com/v1/cryptocurrency/map",
      {
        params: {
          start: 1, // Start at the first cryptocurrency
          limit: 3000, // Limit to 3000 cryptocurrencies
        },
        headers: {
          "X-CMC_PRO_API_KEY": COINMARKETCAP_API_KEY,
        },
      }
    );
    return response.data; // Return the data from the API
  } catch (error) {
    console.error("Error fetching crypto data:", error);
    throw error;
  }
};
