const express = require('express');
const {authenticate, authorizeRole} = require("../middleware/auth");
const {getAssignments, register, login, acceptAssignment, rejectAssignment} = require("../controllers/adminController");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admins
 *   description: Admin management and assignment review
 */

/**
 * @swagger
 * /api/admins/register:
 *   post:
 *     summary: Register a new admin
 *     description: Create a new admin account
 *     tags: [Admins]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username for the new admin account
 *               password:
 *                 type: string
 *                 description: The password for the new admin account
 *     responses:
 *       201:
 *         description: Admin created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the newly created admin
 *                 username:
 *                   type: string
 *                   description: The username of the newly created admin
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: The error message
 */
router.post('/register', register);

/**
 * @swagger
 * /api/admins/login:
 *   post:
 *     summary: Login an existing admin
 *     description: Authenticate an admin
 *     tags: [Admins]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username for the admin account
 *               password:
 *                 type: string
 *                 description: The password for the admin account
 *     responses:
 *       200:
 *         description: Admin logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: The authentication token
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: The error message
 */
router.post('/login', login);

/**
 * @swagger
 * /api/admins/assignments:
 *   get:
 *     summary: Retrieve all assignments for the admin
 *     description: Get a list of all assignments tagged to the logged-in admin
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of assignments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Assignment'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: The error message
 */
router.get('/assignments', authenticate, authorizeRole('Admin'), getAssignments);

/**
 * @swagger
 * /api/admins/assignments/{id}/accept:
 *   post:
 *     summary: Accept an assignment
 *     description: Approve an assignment by its ID
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the assignment to accept
 *     responses:
 *       200:
 *         description: Assignment accepted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmation message
 *       401:
 *         description: Unauthorized request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: The error message
 */
router.post('/assignments/:id/accept', authenticate, authorizeRole('Admin'), acceptAssignment);

/**
 * @swagger
 * /api/admins/assignments/{id}/reject:
 *   post:
 *     summary: Reject an assignment
 *     description: Reject an assignment by its ID
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the assignment to reject
 *     responses:
 *       200:
 *         description: Assignment rejected successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmation message
 *       401:
 *         description: Unauthorized request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: The error message
 */
router.post('/assignments/:id/reject', authenticate, authorizeRole('Admin'), rejectAssignment);

module.exports = router;
