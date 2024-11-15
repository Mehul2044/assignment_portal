const express = require('express');
const {authenticate, authorizeRole} = require("../middleware/auth");
const {uploadAssignment, getAdmins, login, register} = require("../controllers/userController");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and assignment submission
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "user123"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               role:
 *                 type: string
 *                 enum: ["User", "Admin"]
 *                 example: "User"
 *     responses:
 *       201:
 *         description: User registered successfully
 *       500:
 *         description: Registration failed
 */
router.post('/register', register);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: User login
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "user123"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Login failed
 */
router.post('/login', login);

/**
 * @swagger
 * /api/users/upload:
 *   post:
 *     summary: Upload an assignment
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               task:
 *                 type: string
 *                 example: "Complete Project Report"
 *               admin:
 *                 type: string
 *                 example: "adminId123"
 *     responses:
 *       201:
 *         description: Assignment uploaded successfully
 *       500:
 *         description: Failed to upload assignment
 */
router.post('/upload', authenticate, authorizeRole('User'), uploadAssignment);

/**
 * @swagger
 * /api/users/admins:
 *   get:
 *     summary: Get list of all admins
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of admins retrieved successfully
 *       500:
 *         description: Failed to get admins
 */
router.get('/admins', authenticate, getAdmins);

module.exports = router;
