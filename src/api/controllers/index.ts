import { Request, Response } from "express";
import httpStatus from "http-status";
import { getRepository } from "typeorm";
import APIResponse from "../../utils/APIResponse";
import { Country, Transportation } from "../entity";

export const country = {
  controller: async (req: Request, res: Response) => {
    try {
      const countryRepo = getRepository(Country);
      const countries = await countryRepo.find();

      if (countries) {
        return res
          .status(httpStatus.OK)
          .json(new APIResponse(countries, "Data Found", 200));
      }
      throw new Error("Countries Not found");
    } catch (error) {
      return res
        .status(404)
        .json(new APIResponse(null, "Data not Found", 404, error));
    }
  },
};

export const transportationOption = {
  controller: async (req: Request, res: Response) => {
    try {
      const transportationRepo = getRepository(Transportation);

      const options = await transportationRepo.find();

      if (options) {
        return res
          .status(httpStatus.OK)
          .json(new APIResponse(options, "Data Found", 200));
      }
      throw new Error("Options Not found");
    } catch (error) {
      return res
        .status(404)
        .json(new APIResponse(null, "Data not Found", 404, error));
    }
  },
};
