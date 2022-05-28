import { Request, Response } from "express";
import httpStatus from "http-status";
import { getRepository } from "typeorm";
import { OTP, User } from "../entity";
import APIResponse from "../../utils/APIResponse";
import { getJWTToken } from "../../utils/jwt.helper";
import { celebrate } from "celebrate";
import Joi from "joi";
import { RoleType } from "../../utils/constant";
import { generateRandomNumber } from "../../utils/utils";
import { comparePassword, hashPassword } from "../../utils/bcrypt.helper";
import { sendEmailHelper } from "../../utils/emailer";
import { Itinerary } from "../entity/index";

const login = {
  validator: celebrate({
    body: Joi.object().keys({
      email: Joi.string()
        .email({ tlds: { allow: true } })
        .required(),
      password: Joi.string().min(8).required(),
    }),
  }),

  controller: async (req: Request, res: Response) => {
    try {
      const userRepo = getRepository(User);
      const user = await userRepo.findOne({
        where: { email: req.body.email, is_deleted: false },
      });

      if (user) {
        const match = await comparePassword(req.body.password, user.password);

        if (match) {
          const token = getJWTToken({
            id: user.id,
            email: req.body.email,
            role: RoleType.user,
          });

          const newUser = {
            id: user.id,
            avatar: user.avatar,
            first_name: user.first_name,
            last_name: user.last_name,
            user_name: user.user_name,
            email: user.email,
            gender: user.gender,
            nationality: user.nationality,
            mobile: user.mobile,
            dob: user.dob,
            token: token,
          };

          return res
            .status(httpStatus.OK)
            .json(
              new APIResponse(newUser, "Login Successfully", 200, httpStatus.OK)
            );
        } else {
          throw new Error("Incorrect Password");
        }
      } else {
        return res
          .status(404)
          .json(new APIResponse(null, "User not found", 404, httpStatus[404]));
      }
    } catch (error) {
      return res
        .status(400)
        .json(new APIResponse(null, "Incorrect Password", 400, error));
    }
  },
};

const register = {
  validator: celebrate({
    body: Joi.object().keys({
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      user_name: Joi.string().required(),
      email: Joi.string()
        .email({ tlds: { allow: true } })
        .required(),
      password: Joi.string().required().min(8),
      gender: Joi.string().required(),
      nationality: Joi.string().required(),
      mobile: Joi.string().required(),
      dob: Joi.date().required(),
      is_verified: Joi.boolean().valid(true).required(),
    }),
  }),

  controller: async (req: Request, res: Response): Promise<Response> => {
    try {
      const userRepo = getRepository(User);

      // Password Encryption
      const newPassword = await hashPassword(req.body.password, 10);

      const checkUser = await userRepo.findOne({
        where: {
          email: req.body.email,
          is_deleted: false,
        },
      });

      if (!checkUser) {
        // Encrypted password add into user detail
        const newUser = {
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          user_name: req.body.user_name,
          email: req.body.email,
          password: newPassword,
          gender: req.body.gender,
          nationality: req.body.nationality,
          mobile: req.body.mobile,
          dob: req.body.dob,
          is_verified: req.body.is_verified,
        };

        // Create and add the user into database
        const user = userRepo.create(newUser);
        let result = await userRepo.save(user);
        result = JSON.parse(JSON.stringify(result));

        if (result) {
          const newResult = {
            id: result.id,
            avatar: null,
            first_name: result.first_name,
            last_name: result.last_name,
            user_name: result.user_name,
            email: result.email,
            gender: result.gender,
            nationality: result.nationality,
            mobile: result.mobile,
            dob: result.dob,
          };
          return res
            .status(httpStatus.OK)
            .json(new APIResponse(newResult, "User added Succesfully", 200));
        }
        throw new Error("User Not Added");
      }
      throw new Error("User already exists");
    } catch (error) {
      return res
        .status(200)
        .json(new APIResponse(null, "User already exists", 400, error));
    }
  },
};

const sendEmail = {
  validator: celebrate({
    body: Joi.object().keys({
      email: Joi.string()
        .email({ tlds: { allow: true } })
        .required(),
    }),
  }),

  controller: async (req: Request, res: Response) => {
    try {
      const token = getJWTToken({ email: req.body.email });

      // To remove the bearer
      let a = token.split(" ");
      let link = `http://localhost:3000/forgotpass?token=${a[a.length - 1]}`;

      const info = await sendEmailHelper(
        req.body.email,
        "Forgot Password",
        link
      );
      return res
        .status(200)
        .json(
          new APIResponse(
            { message: "Link sent successfully" },
            "Link sent successfully.",
            200
          )
        );
    } catch (error) {
      res.status(400).json(new APIResponse(null, "Wrong Email", 400, error));
    }
  },
};

const forgotPassword = {
  validator: celebrate({
    body: Joi.object().keys({
      password: Joi.string().required(),
    }),
  }),

  controller: async (req: any, res: Response) => {
    try {
      const userRepo = getRepository(User);

      const user = await userRepo.findOne({
        where: { email: req.user.email, is_deleted: false },
      });

      if (!user) {
        return res
          .status(400)
          .json(new APIResponse(null, "Wrong email", 400, httpStatus[400]));
      }

      const newPass = await hashPassword(req.body.password, 10);

      userRepo.merge(user, { password: newPass });
      const results = await userRepo.save(user);

      if (results) {
        return res
          .status(httpStatus.OK)
          .json(new APIResponse(null, "Password Changed", 200));
      }
      throw new Error("Wrong Email");
    } catch (error) {
      return res
        .status(400)
        .json(new APIResponse(null, "Wrong Email", 400, error));
    }
  },
};

const sendOtp = {
  validator: celebrate({
    body: Joi.object().keys({
      mobile: Joi.string().required(),
    }),
  }),

  controller: async (req: Request, res: Response) => {
    try {
      const otpRepo = getRepository(OTP);

      const mobile = await otpRepo.findOne({
        where: { mobile: req.body.mobile },
      });

      if (mobile) {
        return res
          .status(409)
          .json(
            new APIResponse(
              null,
              "Mobile number already exists",
              409,
              httpStatus[409]
            )
          );
      }

      // const code = generateRandomNumber();
      const code = 123456;

      const otpObj = {
        mobile: req.body.mobile,
        code,
      };
      const otp = otpRepo.create(otpObj);
      const result = await otpRepo.save(otp);

      if (result) {
        return res
          .status(httpStatus.OK)
          .json(
            new APIResponse(
              { id: result.id, mobile: result.mobile },
              "Otp sent successfully",
              httpStatus.OK
            )
          );
      }

      throw new Error("Otp Error");
    } catch (error) {
      return res
        .status(500)
        .json(
          new APIResponse(
            null,
            "Otp Error",
            httpStatus.INTERNAL_SERVER_ERROR,
            httpStatus[500]
          )
        );
    }
  },
};

const verifyOtp = {
  validator: celebrate({
    body: Joi.object().keys({
      mobile: Joi.string().required(),
      code: Joi.number().required(),
    }),
  }),

  controller: async (req: Request, res: Response) => {
    try {
      const otpRepo = getRepository(OTP);
      const matchMobile = await otpRepo.findOne({
        where: { mobile: req.body.mobile },
      });

      if (!matchMobile) {
        return res
          .status(400)
          .json(
            new APIResponse(
              null,
              "Incorrect Mobile Number",
              400,
              httpStatus[400]
            )
          );
      }
      const matchOtp = await otpRepo.findOne({
        where: { code: req.body.code },
      });

      if (!matchOtp) {
        return res
          .status(400)
          .json(new APIResponse(null, "Incorrect OTP", 400, httpStatus[400]));
      }

      const result = await otpRepo.delete(matchOtp);

      return res
        .status(httpStatus.OK)
        .json(
          new APIResponse({ is_verified: true }, "Mobile number verified", 200)
        );
    } catch (error) {
      return res.status(400).json(new APIResponse(null, "Error", 400, error));
    }
  },
};

const resetPassword = {
  validator: celebrate({
    body: Joi.object().keys({
      old_password: Joi.string().required(),
      new_password: Joi.string().required(),
    }),
  }),

  controller: async (req: any, res: Response): Promise<Response> => {
    try {
      const userRepo = getRepository(User);
      const user = await userRepo.findOne({ where: { id: req.user.id } });

      const match = await comparePassword(req.body.old_password, user.password);

      if (!match) {
        return res
          .status(400)
          .json(new APIResponse(null, "Wrong Password", 400, httpStatus[400]));
      }

      const new_password = await hashPassword(req.body.new_password, 10);

      userRepo.merge(user, { password: new_password });
      const results = await userRepo.save(user);

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

const deleteUserSelf = {
  controller: async (req: any, res: Response): Promise<Response> => {
    try {
      const userRepo = getRepository(User);
      const user = await userRepo.findOne({ where: { id: req.user.id } });

      userRepo.merge(user, { is_deleted: true });
      const results = await userRepo.save(user);

      if (results) {
        return res
          .status(httpStatus.OK)
          .json(new APIResponse(null, "User Deleted", 200));
      }
      throw new Error("User not Exists");
    } catch (error) {
      return res
        .status(404)
        .json(new APIResponse(null, "User not Exists", 404, error));
    }
  },
};

const edit = {
  validator: celebrate({
    body: Joi.object().keys({
      avatar: Joi.string(),
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      user_name: Joi.string().required(),
      password: Joi.string().required().min(8),
      gender: Joi.string().required(),
      nationality: Joi.string().required(),
      mobile: Joi.string().required(),
      dob: Joi.date().required(),
    }),
  }),

  controller: async (req: any, res: Response): Promise<Response> => {
    try {
      const userRepo = getRepository(User);

      const checkUser = await userRepo.findOne({ where: { id: req.user.id } });

      // Password Encryption
      const newPassword = await hashPassword(req.body.password, 10);

      delete req.body.email;
      if (!checkUser) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json(
            new APIResponse(null, "User not edited", httpStatus.BAD_REQUEST)
          );
      }

      userRepo.merge(checkUser, {
        avatar: req.body.avatar,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        user_name: req.body.user_name,
        password: newPassword,
        gender: req.body.gender,
        nationality: req.body.nationality,
        mobile: req.body.mobile,
        dob: req.body.dob,
      });
      const result = await userRepo.save(checkUser);

      if (result) {
        const newResult = {
          avatar: result.avatar,
          first_name: result.first_name,
          last_name: result.last_name,
          user_name: result.user_name,
          gender: result.gender,
          nationality: result.nationality,
          mobile: result.mobile,
          dob: result.dob,
        };
        return res
          .status(httpStatus.OK)
          .json(new APIResponse(newResult, "Profile changed", 200));
      }
      throw new Error("User not Exists");
    } catch (error) {
      return res
        .status(500)
        .json(new APIResponse(null, "User not edited", 500, error));
    }
  },
};

const getUser = {
  controller: async (req: any, res: Response) => {
    try {
      const userRepo = getRepository(User);
      const user = await userRepo.findOne({
        where: { id: req.user.id, is_deleted: false },
      });

      if (user) {
        const newUser = {
          id: user.id,
          avatar: user.avatar,
          first_name: user.first_name,
          last_name: user.last_name,
          user_name: user.user_name,
          email: user.email,
          gender: user.gender,
          nationality: user.nationality,
          mobile: user.mobile,
          dob: user.dob,
        };
        return res
          .status(200)
          .json(new APIResponse(newUser, "User found", 200));
      }
      throw new Error("User not found");
    } catch (error) {
      return res
        .status(400)
        .json(new APIResponse(null, "User not found", 400, error));
    }
  },
};

export {
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
};
