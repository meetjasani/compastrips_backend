import express from "express";
import { userRole } from "../../utils/middlewares";
import { deleteUserByAdmin, getUsers, login, resetPassword } from "../controllers/admin";

const router = express();

/**
 * @swagger
 * /admin/auth/login:
 *  post:
 *    tags: [Admin]
 *    description: test all 
 *    parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      schema:
 *        type: object
 *        properties:
 *          email:
 *            type: string
 *          password:
 *            type: string
 *    responses:
 *      200:
 *        description: Success
 * 
 */
router.post("/auth/login", login.validator, login.controller);

/**
 * @swagger
 * /admin/users:
 *  get:
 *    tags: [Admin]
 *    description: test all 
 *    security: 
 *    - Token: []
 *    responses:
 *      200:
 *        description: Success
 * 
 */
router.get("/users", userRole, getUsers.controller);

/**
 * @swagger
 * /admin/auth/reset:
 *  post:
 *    tags: [Admin]
 *    description: test all 
 *    security: 
 *    - Token: []
 *    parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      schema:
 *        type: object
 *        properties:
 *          old_password:
 *            type: string
 *          new_password:
 *            type: string
 *    responses:
 *      200:
 *        description: Success
 * 
 */
router.post("/auth/reset", resetPassword.validator, resetPassword.controller);

/**
 * @swagger
 * /admin/auth/deleteUser/:id:
 *  patch:
 *    tags: [Admin]
 *    description: test all 
 *    security: 
 *    - Token: []
 *    parameters:
 *    - in: query
 *      name: body
 *      required: true
 *      type: string
 *    responses:
 *      200:
 *        description: Success
 *        content: {}
 * 
 */
 router.patch("/auth/deleteUser/:id",deleteUserByAdmin.validator, userRole, deleteUserByAdmin.controller)

export default router;
