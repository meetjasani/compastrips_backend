import express from "express";
import { validateUserByToken } from "../../utils/middlewares";
import {
  getCategory,
  getItinerary,
  getItineraryCourses,
  getRegion,
  getTourCourses,
  getUserItinery,
  tourcourseByFilter,
  tourcourseByRegion,
} from "../controllers/itinerary";
import { createItinerary } from "../controllers/itinerary";

const router = express.Router();

/**
 * @swagger
 * /itinerary/create:
 *  post:
 *    tags: [Itinerary]
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
 *          title:
 *            type: string
 *          information:
 *            type: string
 *          disclosure:
 *            type: string
 *          creator:
 *            type: string
 *          start_date:
 *            type: string
 *          end_date:
 *            type: string
 *          nationality:
 *            type: string
 *          courses:
 *            type: string
 *          created_by:
 *            type: string
 *    responses:
 *      200:
 *        description: Success
 *        content: {}
 *
 */
router.post(
  "/create",
  createItinerary.validator,
  validateUserByToken,
  createItinerary.controller
);

/**
 * @swagger
 * /itinerary/get:
 *  get:
 *    tags: [Itinerary]
 *    description: test all
 *    responses:
 *      200:
 *        description: Success
 *        content: {}
 *
 */
router.get("/get", getItinerary.controller);

/**
 * @swagger
 * /itinerary/tourcourse:
 *  get:
 *    tags: [Itinerary]
 *    description: test all
 *    responses:
 *      200:
 *        description: Success
 *        content: {}
 *
 */
router.get("/tourcourse", getTourCourses.controller);

/**
 * @swagger
 * /itinerary/courses/:id:
 *  get:
 *    tags: [Itinerary]
 *    description: test all
 *    responses:
 *      200:
 *        description: Success
 *        content: {}
 *
 */
router.get(
  "/courses/:id",
  getItineraryCourses.validator,
  getItineraryCourses.controller
);

/**
 * @swagger
 * /itinerary/getbyuser:
 *  get:
 *    tags: [Itinerary]
 *    description: get itineraries for current user
 *    security:
 *    - Token: []
 *    responses:
 *      200:
 *        description: Success
 *        content: {}
 *
 */
router.get("/getbyuser", getUserItinery.controller);

/**
 * @swagger
 * /itinerary/region:
 *  get:
 *    tags: [Itinerary]
 *    description: get itineraries for current user
 *    security:
 *    - Token: []
 *    responses:
 *      200:
 *        description: Success
 *        content: {}
 *
 */
router.get("/region", getRegion.controller);

/**
 * @swagger
 * /itinerary/category:
 *  get:
 *    tags: [Itinerary]
 *    description: get itineraries for current user
 *    security:
 *    - Token: []
 *    responses:
 *      200:
 *        description: Success
 *        content: {}
 *
 */
router.get("/category", getCategory.controller);
// http://localhost:5000/api/v1/itinerary

/**
 * @swagger
 * /itinerary/:
 *  get:
 *    tags: [Itinerary]
 *    description: get itineraries for current user
 *    security:
 *    - Token: []
 *    responses:
 *      200:
 *        description: Success
 *        content: {}
 *
 */
router.get("/", tourcourseByFilter.validator, tourcourseByFilter.controller);

export default router;
