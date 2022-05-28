import express from "express";
import { beParticipant, createHosting, getParticipants } from "../controllers/hosting";

const router = express.Router();

/**
 * @swagger
 * /hosting/create:
 *  post:
 *    tags: [Hosting]
 *    description: add new hosting in database
 *    parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      schema:
 *        type: object
 *        properties:
 *          type:
 *            type: string
 *          date:
 *            type: string
 *          start_time:
 *            type: string
 *          end_time:
 *            type: string
 *          location:
 *            type: string
 *          status:
 *            type: string
 *          transportation:
 *            type: string
 *          pax:
 *            type: number
 *          host_information:
 *            type: string
 *          itinerary_id:
 *            type: string
 *    responses:
 *      200:
 *        description: Success
 *        content: {}
 * 
 */
router.post("/create", createHosting.validator, createHosting.controller)

/**
 * @swagger
 * /hosting/participate:
 *  post:
 *    tags: [Hosting]
 *    description: join the tour and be participant
 *    parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      schema:
 *        type: object
 *        properties:
 *          hosting_id:
 *            type: string
 *    responses:
 *      200:
 *        description: Success
 *        content: {}
 * 
 */
router.post("/participate", beParticipant.controller)

/**
 * @swagger
 * /hosting/getParticipants:
 *  post:
 *    tags: [Hosting]
 *    description: participants of one hosting
 *    parameters:
 *    - in: body
 *      name: body
 *      required: true
 *      schema:
 *        type: object
 *        properties:
 *          hosting_id:
 *            type: string
 *    responses:
 *      200:
 *        description: Success
 *        content: {}
 * 
 */
router.post("/getParticipants", getParticipants.validator, getParticipants.controller)

export default router