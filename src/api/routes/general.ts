import express from "express";
import { country, transportationOption } from "../controllers";

const router = express.Router();

/**
 * @swagger
 * /general/country:
 *  get:
 *    tags: [General]
 *    description: test all
 *    responses:
 *      200:
 *        description: Success
 *        content: {}
 *
 */
router.get("/country", country.controller);

/**
 * @swagger
 * /general/transportation:
 *  get:
 *    tags: [General]
 *    description: test all
 *    responses:
 *      200:
 *        description: Success
 *        content: {}
 *
 */
router.get("/transportation", transportationOption.controller);
export default router;
