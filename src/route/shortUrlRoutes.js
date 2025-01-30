const express = require("express");
const Router = express.Router();
const urlController = require("../controller/shortUrlController");
const authenticateJWT = require("../middleware/auth");

const rateLimit = require('express-rate-limit');

// Rate limiter middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // limit each IP to 10 requests per windowMs
  message: 'Too many requests, please try again later.'
});

Router.post("/", authenticateJWT, limiter, urlController.shortUrl);
Router.get("/:urlCode", urlController.getUrl);

Router.use("*", (req, res) => {
  return res.status(404).send("invalid urls");
});
module.exports = Router;