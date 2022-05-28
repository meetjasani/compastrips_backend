import { celebrate } from "celebrate";
import { Request, Response } from "express";
import httpStatus from "http-status";
import Joi, { object } from "joi";
import { getRepository } from "typeorm";
import APIResponse from "../../utils/APIResponse";
import { Itinerary, TourCourse, TourcourseItinerary } from "../entity/index";

const createItinerary = {
  validator: celebrate({
    body: Joi.object().keys({
      title: Joi.string().required(),
      information: Joi.string().required(),
      disclosure: Joi.string().valid("OPEN", "PRIVATE").required(),
      creator: Joi.string().valid("Compastrips", "Host").required(),
      start_date: Joi.date().required(),
      end_date: Joi.date().required(),
      courses: Joi.array().min(1).required(),
    }),
  }),

  controller: async (req: any, res: Response): Promise<Response> => {
    try {
      const itineraryRepo = getRepository(Itinerary);

      let created_by;

      if (req.user.role === "ADMIN") {
        created_by = null;
      } else {
        created_by = req.user;
      }

      let itinerary = await itineraryRepo.save(
        itineraryRepo.create({
          title: req.body.title,
          information: req.body.information,
          disclosure: req.body.disclosure,
          creator: req.body.creator,
          start_date: req.body.start_date,
          end_date: req.body.end_date,
          user: created_by,
        })
      );

      if (itinerary) {
        const courseItitneraryRepo = getRepository(TourcourseItinerary);

        let courses: string[] = req.body.courses;
        const tour = getRepository(TourCourse);

        await Promise.all(
          courses.map(async (x) => {
            return courseItitneraryRepo.save(
              courseItitneraryRepo.create({
                tourcourse: await tour.findOne({ where: { id: x } }),
                itinerary: itinerary,
              })
            );
          })
        );
        return res
          .status(httpStatus.OK)
          .json(new APIResponse(itinerary, "Itinearary added", 200));
      }
      throw new Error("Itinerary not add");
    } catch (error) {
      return res
        .status(500)
        .json(new APIResponse(null, "Itinearary not add", 500, error));
    }
  },
};

const getItinerary = {
  controller: async (req: Request, res: Response): Promise<Response> => {
    try {
      const itineraryRepo = getRepository(Itinerary);

      const itineraries = await itineraryRepo
        .createQueryBuilder("itinerary")
        .select(["user.id", "itinerary"])
        .leftJoin("itinerary.user", "user")
        .getMany();

      if (itineraries) {
        return res
          .status(httpStatus.OK)
          .json(
            new APIResponse(
              itineraries,
              "Itinerary found Successfully",
              200,
              httpStatus.OK
            )
          );
      }
      throw new Error("Itinerary not found");
    } catch (error) {
      return res
        .status(500)
        .json(new APIResponse(null, "Itinearary not added", 500, error));
    }
  },
};

const getUserItinery = {
  controller: async (req: any, res: Response): Promise<Response> => {
    try {
      const itinerayRepo = getRepository(Itinerary);

      const data = await itinerayRepo.find({
        select: [
          "id",
          "title",
          "creator",
          "information",
          "disclosure",
          "start_date",
          "end_date",
        ],
        where: { user: req.user.id },
      });

      if (data) {
        return res
          .status(httpStatus.OK)
          .json(new APIResponse(data, "Itineraries found for User", 200));
      }
      throw new Error("Itineraries not found for User");
    } catch (error) {
      return res
        .status(500)
        .json(
          new APIResponse(
            null,
            "Itineraries not found for User",
            httpStatus.INTERNAL_SERVER_ERROR,
            error
          )
        );
    }
  },
};

const getTourCourses = {
  controller: async (req: Request, res: Response): Promise<Response> => {
    try {
      const tourcourseRepo = getRepository(TourCourse);

      const tourCourses = await tourcourseRepo.find();

      if (tourCourses) {
        return res
          .status(httpStatus.OK)
          .json(
            new APIResponse(tourCourses, "TourCourses get successfully.", 200)
          );
      }

      throw new Error("Cannot get TourCourses.");
    } catch (error) {
      return res
        .status(500)
        .json(
          new APIResponse(
            null,
            "Cannot get TourCourses.",
            httpStatus.INTERNAL_SERVER_ERROR,
            error
          )
        );
    }
  },
};

const getItineraryCourses = {
  validator: celebrate({
    params: Joi.object().keys({
      id: Joi.string().required(),
    }),
  }),

  controller: async (req: any, res: Response): Promise<Response> => {
    try {
      const courseItinerayRepo = getRepository(TourcourseItinerary);

      const data = await courseItinerayRepo.find({
        relations: ["tourcourse"],
        where: { itinerary: req.params.id },
      });

      if (data) {
        return res
          .status(httpStatus.OK)
          .json(new APIResponse(data, "Courses found", 200));
      }
      throw new Error("Courses not found");
    } catch (error) {
      return res
        .status(404)
        .json(new APIResponse(null, "Courses not found", 404, error));
    }
  },
};

// filter routes
const getRegion = {
  controller: async (req: Request, res: Response): Promise<Response> => {
    try {
      const tourcourseRepo = getRepository(TourCourse);

      const region = await tourcourseRepo
        .createQueryBuilder("tour_course")
        .select("region")
        .distinct(true)
        .getRawMany();

      if (region) {
        return res
          .status(httpStatus.OK)
          .json(new APIResponse(region, "Region found", httpStatus.OK));
      }
      throw new Error("Region not found");
    } catch (error) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new APIResponse(
            null,
            "Region not found",
            httpStatus.INTERNAL_SERVER_ERROR,
            httpStatus[500]
          )
        );
    }
  },
};

const getCategory = {
  controller: async (req: Request, res: Response): Promise<Response> => {
    try {
      const tourcourseRepo = getRepository(TourCourse);

      const region = await tourcourseRepo
        .createQueryBuilder("tour_course")
        .select("category")
        .distinct(true)
        .getRawMany();

      if (region) {
        return res
          .status(httpStatus.OK)
          .json(new APIResponse(region, "Region found", httpStatus.OK));
      }
      throw new Error("Region not found");
    } catch (error) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new APIResponse(
            null,
            "Region not found",
            httpStatus.INTERNAL_SERVER_ERROR,
            httpStatus[500]
          )
        );
    }
  },
};

const tourcourseByRegion = {
  validator: celebrate({
    query: Joi.object().keys({
      region: Joi.string().required(),
    }),
  }),

  controller: async (req: Request, res: Response): Promise<Response> => {
    try {
      const tourcourseRepo = getRepository(TourCourse);

      const region = await tourcourseRepo
        .createQueryBuilder("tour_course")
        .where("region = :name", { name: req.query.region })
        .getMany();

      if (region) {
        return res
          .status(httpStatus.OK)
          .json(new APIResponse(region, "TourCourse found", httpStatus.OK));
      }
      throw new Error("TourCourse not found");
    } catch (error) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new APIResponse(
            null,
            "TourCourse not found",
            httpStatus.INTERNAL_SERVER_ERROR,
            httpStatus[500]
          )
        );
    }
  },
};

const tourcourseByFilter = {
  validator: celebrate({
    query: Joi.object().keys({
      region: Joi.string().required(),
      category: Joi.array().min(1).required(),
    }),
  }),

  controller: async (req: any, res: Response): Promise<Response> => {
    try {
      const tourcourseRepo = getRepository(TourCourse);

      let category = req.query.category;

      const region = await tourcourseRepo
        .createQueryBuilder("tour_course")
        .where("region = :name", { name: req.query.region })
        .andWhere("category IN(categories)", {
          categories: category.split(","),
        })
        .getMany();

      if (region) {
        return res
          .status(httpStatus.OK)
          .json(new APIResponse(region, "TourCourse found", httpStatus.OK));
      }
      throw new Error("TourCourse not found");
    } catch (error) {
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new APIResponse(
            null,
            "TourCourse not found",
            httpStatus.INTERNAL_SERVER_ERROR,
            httpStatus[500]
          )
        );
    }
  },
};

const like = {};

const deleteLike = {};

export {
  createItinerary,
  getItinerary,
  getTourCourses,
  getItineraryCourses,
  like,
  deleteLike,
  getUserItinery,
  getRegion,
  getCategory,
  tourcourseByRegion,
  tourcourseByFilter,
};
