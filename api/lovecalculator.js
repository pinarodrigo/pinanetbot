const axios = require("axios");
const config = require('../config/config');
const BASE_URL = "https://love-calculator.p.rapidapi.com";

module.exports = {
  getPercentage: (yourName, partnerName) => axios({
      "method": "GET",
      "url": `${BASE_URL}/getPercentage`,
      "headers": {
        "content-type": "application/octet-stream",
        "x-rapidapi-host": "love-calculator.p.rapidapi.com",
        "x-rapidapi-key": config.env.RAPID_API_KEY
      },
      "params": {
        "fname": yourName,
        "sname": partnerName
        }
      })
};