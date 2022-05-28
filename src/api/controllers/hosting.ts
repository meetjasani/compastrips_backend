import { Request, Response } from "express";
import httpStatus from "http-status";
import { getRepository } from "typeorm";
import APIResponse from "../../utils/APIResponse";
import { celebrate } from "celebrate";
import Joi from "joi";
import { Hosting, Itinerary, Participant, User } from "../entity";

const createHosting = {
  validator: celebrate({
    body: Joi.object().keys({
      type: Joi.string().valid("LOCAL", "TRAVELER").required(),
      date: Joi.date().required(),
      start_time: Joi.string().required(),
      end_time: Joi.string().required(),
      location: Joi.string().required(),
      status: Joi.string().valid("ONGOING", "COMPLETE", "UPCOMING"),
      transportation: Joi.string().required(),
      pax: Joi.number().min(0).max(9).required(),
      host_information: Joi.string().required(),
      itinerary_id: Joi.string().required(),
    }),
  }),

  controller: async (req: any, res: Response): Promise<Response> => {
    try {
      const hostingRepo = getRepository(Hosting);
      const itineraryRepo = getRepository(Itinerary);
      const userRepo = getRepository(User);

      const itinerary = await itineraryRepo.findOne(req.body.itinerary_id);

      const oldHosting = await hostingRepo.findOne({
        where: { user: req.user.id, status: "UPCOMING" || "ONGOING" },
      });

      if (oldHosting) {
        return res
          .status(400)
          .json(
            new APIResponse({}, "User have already created one hosting", 400)
          );
      }

      const user = await userRepo.findOne(req.user.id);

      const newHosting = {
        type: req.body.type,
        date: req.body.date,
        start_time: req.body.start_time,
        end_time: req.body.end_time,
        location: req.body.location,
        status: req.body.status,
        transportation: req.body.transportation,
        pax: req.body.pax,
        host_information: req.body.host_information,
        user: user,
        itinerary: itinerary,
      };

      // Create and add the hosting into database
      const hosting = hostingRepo.create(newHosting);
      let result = await hostingRepo.save(hosting);
      result = JSON.parse(JSON.stringify(result));

      if (result) {
        return res
          .status(httpStatus.OK)
          .json(new APIResponse(result, "Hosting successfully", 200));
      }
      throw new Error("Error in making hosting");
    } catch (error) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(new APIResponse(null, "Error in making hosting", 400, error));
    }
  },
};

const beParticipant = {
  validator: celebrate({
    body: Joi.object().keys({
      hosting_id: Joi.string().required(),
    }),
  }),

  controller: async (req: any, res: Response): Promise<Response> => {
    try {
      const hostingRepo = getRepository(Hosting);
      const participantRepo = getRepository(Participant);
      const userRepo = getRepository(User);

      const hosting = await hostingRepo.findOne(req.body.hosting_id);
      const user = await userRepo.findOne(req.user.id);

      const newParticipant = {
        hosting: hosting,
        user: user,
      };

      // Create and add the Participant into database
      const participant = participantRepo.create(newParticipant);
      let result = await participantRepo.save(participant);

      result = JSON.parse(JSON.stringify(result));

      if (result) {
        const newResult = {
          id: result.id,
          hosting: {
            id: result.hosting.id,
          },
          user: {
            id: result.user.id,
          },
        };
        return res
          .status(httpStatus.OK)
          .json(
            new APIResponse(
              newResult,
              "Application successfully sent to the host",
              200
            )
          );
      }
      throw new Error("Error in sending application to host");
    } catch (error) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(
          new APIResponse(
            null,
            "Error in sending application to host",
            400,
            error
          )
        );
    }
  },
};

const getParticipants = {
  validator: celebrate({
    body: Joi.object().keys({
      hosting_id: Joi.string().required(),
    }),
  }),

  controller: async (req: any, res: Response): Promise<Response> => {
    try {
      const participantRepo = getRepository(Participant);
      const userRepo = getRepository(User);

      const participants = await participantRepo
        .createQueryBuilder("participant")
        .select(["user.id", "user.first_name", "id"])
        .leftJoin("participant.user", "user") // bar is the joined table
        // .where({ hosting_id: req.body.hosting_id})
        .getMany();

      console.log(participants);

      throw new Error("Error in sending application to host");
    } catch (error) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(
          new APIResponse(
            null,
            "Error in sending application to host",
            400,
            error
          )
        );
    }
  },
};

export { createHosting, beParticipant, getParticipants };
