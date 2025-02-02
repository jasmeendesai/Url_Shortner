const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');

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
 */

/**
 * @swagger
 * /google:
 *   get:
 *     summary: Initiate Google OAuth authentication
 *     responses:
 *       '302':
 *         description: Redirect to Google authentication page
 */

/**
 * @swagger
 * /google/callback:
 *   get:
 *     summary: Handle Google OAuth callback and return token
 *     responses:
 *       '200':
 *         description: Successful authentication, returns token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 */
router.get('/google', authController.googleAuth);
router.get('/google/callback', authController.googleCallback);

module.exports = router;
