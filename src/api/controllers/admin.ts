import { celebrate } from "celebrate";
import { Request, Response } from "express";
import httpStatus from "http-status";
import Joi from "joi";
import { getRepository } from "typeorm";
import APIResponse from "../../utils/APIResponse";
import { RoleType } from "../../utils/constant";
import { getJWTToken } from "../../utils/jwt.helper";
import { Admin, User } from "../entity";

export const login = {
  validator: celebrate({
    body: Joi.object().keys({
      email: Joi.string()
        .email({ tlds: { allow: true } })
        .required(),
      password: Joi.string().min(8).required(),
    }),
  }),

  controller: async (req: Request, res: Response): Promise<Response> => {
    try {
      const adminRepo = getRepository(Admin);
      const user = await adminRepo.findOne({
        where: { email: req.body.email },
      });

      if (!user) {
        throw new Error("Email does not exists.");
      }

      const passwordMatch = await adminRepo.findOne({
        where: { password: req.body.password },
      });

      if (!passwordMatch) {
        throw new Error("Incorrect Password");
      }

      const token = getJWTToken({
        id: user.id,
        email: req.body.email,
        role: RoleType.admin,
      });

      const newUser = {
        id: user.id,
        email: req.body.email,
        role: RoleType.admin,
        token,
      };

      return res
        .status(httpStatus.OK)
        .json(
          new APIResponse(newUser, "Login Successfully", 200, httpStatus[200])
        );
    } catch (error) {
      return res
        .status(400)
        .json(new APIResponse(null, "Login Falied", 400, error));
    }
  },
};

export const resetPassword = {
  validator: celebrate({
    body: Joi.object().keys({
      old_password: Joi.string().required(),
      new_password: Joi.string().required(),
    }),
  }),

  controller: async (req: any, res: Response): Promise<Response> => {
    try {
      const adminRepo = getRepository(Admin);
      const user = await adminRepo.findOne({ where: { id: req.user.id } });

      if (!user) {
        return res
          .status(404)
          .json(new APIResponse(null, "User not Exists", 404, httpStatus[404]));
      }

      if (!(req.body.old_password == user.password)) {
        return res
          .status(400)
          .json(new APIResponse(null, "Wrong Password", 400, httpStatus[400]));
      }

      adminRepo.merge(user, { password: req.body.new_password });
      const results = await adminRepo.save(user);

      if (results) {
        return res
          .status(httpStatus.OK)
          .json(new APIResponse(null, "Password Changed", 200));
      }
      throw new Error("User not Exists");
    } catch (error) {
      return res
        .status(404)
        .json(new APIResponse(null, "User not Exists", 404, error));
    }
  },
};

export const getUsers = {
  validator: () => {},

  controller: async (req: Request, res: Response): Promise<Response> => {
    try {
      const userRepo = getRepository(User);

      const users = await userRepo.find({ where: { is_deleted: false } });

      if (users) {
        return res
          .status(httpStatus.OK)
          .json(
            new APIResponse(users, "Users get successfully.", httpStatus.OK)
          );
      }

      throw new Error("Users not found.");
    } catch (error) {
      return res
        .status(404)
        .json(
          new APIResponse(
            null,
            "Cannot get Users.",
            httpStatus.NOT_FOUND,
            error
          )
        );
    }
  },
};

export const deleteUserByAdmin = {
  validator: celebrate({
    params: Joi.object().keys({
      id: Joi.string().required(),
    }),
  }),

  controller: async (req: any, res: Response): Promise<Response> => {
    try {
      const userRepo = getRepository(User);
      const user = await userRepo.findOne({
        where: { id: req.params.id, is_deleted: false },
      });

      if (!user) {
        return res
          .status(404)
          .json(new APIResponse(null, "User not Exists", 404, httpStatus[404]));
      }

      userRepo.merge(user, { is_deleted: true });
      const results = await userRepo.save(user);

      if (results) {
        return res
          .status(httpStatus.OK)
          .json(new APIResponse(results, "User Deleted", 200));
      }
      throw new Error("User not Exists");
    } catch (error) {
      return res
        .status(404)
        .json(new APIResponse(null, "User not Exists", 404, error));
    }
  },
};
