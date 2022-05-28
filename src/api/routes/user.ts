import express from "express";
import { validateUser, validateUserByToken } from "../../utils/middlewares";
import { getUsers } from "../controllers/admin";
import {
  register,
  login,
  forgotPassword,
  sendOtp,
  verifyOtp,
  resetPassword,
  deleteUserSelf,
  edit,
  sendEmail,
  getUser,
} from "../controllers/user";

const router = express.Router();

/**
 * @swagger
 * /user/auth/signup:
 *  post:
 *    tags: [User]
 *    description: test all
 *    parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      schema:
 *        type: object
 *        properties:
 *          first_name:
 *            type: string
 *          last_name:
 *            type: string
 *          user_name:
 *            type: string
 *          email:
 *            type: string
 *          password:
 *            type: string
 *          gender:
 *            type: string
 *          nationality:
 *            type: string
 *          mobile:
 *            type: string
 *          dob:
 *            type: string
 *          is_verified:
 *            type: boolean
 *    responses:
 *      200:
 *        description: Success
 *        content: {}
 *
 */
router.post("/auth/signup", register.validator, register.controller);

/**
 * @swagger
 * /user/auth/login:
 *  post:
 *    tags: [User]
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
 * /user/auth/forgot:
 *  post:
 *    tags: [User]
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
 *          password:
 *            type: string
 *    responses:
 *      200:
 *        description: Success
 *        content: {}
 *
 */
router.post("/forgot", forgotPassword.validator, forgotPassword.controller);

/**
 * @swagger
 * /user/auth/reset:
 *  post:
 *    tags: [User]
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
 *        content: {}
 *
 */
router.post(
  "/auth/reset",
  resetPassword.validator,
  validateUserByToken,
  resetPassword.controller
);

/**
 * @swagger
 * /user/auth/edit:
 *  patch:
 *    tags: [User]
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
 *          first_name:
 *            type: string
 *          last_name:
 *            type: string
 *          user_name:
 *            type: string
 *          password:
 *            type: string
 *          gender:
 *            type: string
 *          nationality:
 *            type: string
 *          mobile:
 *            type: string
 *          dob:
 *            type: string
 *    responses:
 *      200:
 *        description: Success
 *        content: {}
 *
 */
router.patch(
  "/auth/edit",
  edit.validator,
  validateUserByToken,
  edit.controller
);

/**
 * @swagger
 * /user/auth/delete:
 *  patch:
 *    tags: [User]
 *    description: test all
 *    security:
 *    - Token: []
 *    responses:
 *      200:
 *        description: Success
 *        content: {}
 *
 */
router.patch("/auth/delete", validateUserByToken, deleteUserSelf.controller);

/**
 * @swagger
 * /user/otp-send:
 *  post:
 *    tags: [User]
 *    description: test all
 *    parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      schema:
 *        type: object
 *        properties:
 *          mobile:
 *            type: string
 *    responses:
 *      200:
 *        description: Success
 *        content: {}
 *
 */
router.post("/otp-send", sendOtp.validator, sendOtp.controller);

/**
 * @swagger
 * /user/otp-verify:
 *  post:
 *    tags: [User]
 *    description: test all
 *    parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      schema:
 *        type: object
 *        properties:
 *          mobile:
 *            type: string
 *          code:
 *            type: number
 *    responses:
 *      200:
 *        description: Success
 *        content: {}
 *
 */
router.post("/otp-verify", verifyOtp.validator, verifyOtp.controller);

/**
 * @swagger
 * /user/sendForgotlink:
 *  post:
 *    tags: [User]
 *    description: check email before send
 *    parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      schema:
 *        type: object
 *        properties:
 *          email:
 *            type: string
 *    responses:
 *      200:
 *        description: Success
 *        content: {}
 *
 */
router.post(
  "/sendForgotlink",
  sendEmail.validator,
  validateUser,
  sendEmail.controller
);

/**
 * @swagger
 * /user/getUser:
 *  get:
 *    tags: [User]
 *    description: get itineraries for current user
 *    security:
 *    - Token: []
 *    responses:
 *      200:
 *        description: Success
 *        content: {}
 *
 */
router.get("/getUser", getUser.controller);

export default router;
