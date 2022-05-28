import { Application } from "express";
import user from "./user";
import general from "./general";
import admin from "./admin";
import itinerary from "./itinerary";
import jwt from "express-jwt";
import { jwtSecret } from "../../../config";
import hosting from "./hosting";

export const setup = (app: Application) => {
  app.use(
    "/api/v1",
    jwt({ algorithms: ["HS256"], secret: jwtSecret }).unless({
      path: [
        "/api/v1/general/country",
        "/api/v1/user/auth/login",
        "/api/v1/user/auth/signup",
        "/api/v1/user/otp-send",
        "/api/v1/user/otp-verify",
        "/api/v1/user/sendForgotlink",
        "/api/v1/admin/auth/login",
      ],
    })
  );

  app.use("/api/v1/user", user);

  app.use("/api/v1/general", general);

  app.use("/api/v1/admin", admin);

  app.use("/api/v1/itinerary", itinerary);

  app.use("/api/v1/hosting", hosting);
};
