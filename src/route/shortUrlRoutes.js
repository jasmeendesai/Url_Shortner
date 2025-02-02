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

/**
 * @swagger
 * components:
 *   schemas:
 *     Url:
 *       type: object
 *       required:
 *         - longUrl
 *         - shortUrl
 *         - urlCode
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
 * /api/shorten:
 *   post:
 *     summary: Shorten a long URL
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               longUrl:
 *                 type: string
 *               topic:
 *                 type: string
 *     responses:
 *       '200':
 *         description: URL shortened successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Url'
 *       '429':
 *         description: Too many requests
 */

/**
 * @swagger
 * /api/shorten/{urlCode}:
 *   get:
 *     summary: Retrieve the original URL from the shortened URL code
 *     parameters:
 *       - in: path
 *         name: urlCode
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: URL retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Url'
 *       '404':
 *         description: URL not found
 */

Router.post("/", authenticateJWT, limiter, urlController.shortUrl);
Router.get("/:urlCode", urlController.getUrl);

Router.use("*", (req, res) => {
  return res.status(404).send("invalid urls");
});

module.exports = Router;
