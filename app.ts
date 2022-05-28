import express, { Application, Request, Response } from "express";
import { createConnection } from "typeorm";
import { setup } from "./src/api/routes";
import { development, production, test } from "./src/database/config";
import cors from "cors";
import { errors } from "celebrate";

import dotenv from "dotenv";
import { adminSetup } from "./adminBro";
import { setSwagger } from "./swagger";
import helmet from "helmet";

dotenv.config();

let environment;

if (process.env.NODE_ENV === "production") {
  environment = production;
} else {
  environment = development;
}

const PORT = process.env.PORT || 5000;

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use(helmet());
app.set("trust proxy", true);

app.get("/", (req, res) => {
  res.json({
    message: "🏡 Hello 🏡",
  });
});

setSwagger(app);
adminSetup(app);
setup(app);
app.use(errors());

createConnection(environment)
  .then(() => {
    app.listen(PORT, () =>
      console.log(`App is running on http://localhost:${PORT}`)
    );
  })
  .catch((e) => {
    console.log("Error: ", e);
  });
