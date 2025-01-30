const express = require("express");
const Router = express.Router();
const analyticsController = require("../controller/analyticsController");
const authenticateJWT = require("../middleware/auth");

Router.get("/overall", authenticateJWT, analyticsController.getOverAllAnalytics);
Router.get("/:alias", authenticateJWT, analyticsController.getAnalytics);
Router.get("/topic/:topic", authenticateJWT, analyticsController.getTopicAnalytics);

module.exports = Router;