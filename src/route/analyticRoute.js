const express = require("express");
const Router = express.Router();
const analyticsController = require("../controller/analyticsController");
const authenticateJWT = require("../middleware/auth");

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - googleId
 *         - displayName
 *         - email
 *       properties:
 *         googleId:
 *           type: string
 *         displayName:
 *           type: string
 *         email:
 *           type: string
 *     Url:
 *       type: object
 *       properties:
 *         longUrl:
 *           type: string
 *         shortUrl:
 *           type: string
 *         urlCode:
 *           type: string
 *         alias:
 *           type: string
 *         topic:
 *           type: string
 *           enum: ["acquisition", "activation", "retention"]
 *         userId:
 *           type: string
 *         clicks:
 *           type: integer
 *         analytics:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               userAgent:
 *                 type: string
 *               ipAddress:
 *                 type: string
 *               location:
 *                 type: object
 *                 properties:
 *                   country:
 *                     type: string
 *                   region:
 *                     type: string
 *                   city:
 *                     type: string
 *                   latitude:
 *                     type: number
 *                   longitude:
 *                     type: number
 *               timestamp:
 *                 type: string
 *                 format: date-time
 */

/**
 * @swagger
 * /api/analytics/overall:
 *   get:
 *     summary: Get overall analytics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful response with overall analytics
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Url'
 */

/**
 * @swagger
 * /api/analytics/{alias}:
 *   get:
 *     summary: Get analytics by alias
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: alias
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response with analytics by alias
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Url'
 */

/**
 * @swagger
 * /api/analytics/topic/{topic}:
 *   get:
 *     summary: Get analytics by topic
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: topic
 *         required: true
 *         schema:
 *           type: string
 *           enum: ["acquisition", "activation", "retention"]
 *     responses:
 *       '200':
 *         description: Successful response with analytics by topic
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Url'
 */

Router.get("/overall", authenticateJWT, analyticsController.getOverAllAnalytics);
Router.get("/:alias", authenticateJWT, analyticsController.getAnalytics);
Router.get("/topic/:topic", authenticateJWT, analyticsController.getTopicAnalytics);

module.exports = Router;
