import AdminBro from "admin-bro";
import AdminBroExpress from "@admin-bro/express";
import { Database, Resource } from "@admin-bro/typeorm";
import { Application } from "express";
import { Country, User } from "./src/api/entity";

AdminBro.registerAdapter({ Database, Resource });

export const adminSetup = (app: Application) => {
  const adminBro = new AdminBro({
    // databases: [connection],
    rootPath: "/admin",
    resources: [],
  });

  const router = AdminBroExpress.buildRouter(adminBro);
  app.use(adminBro.options.rootPath, router);
};
