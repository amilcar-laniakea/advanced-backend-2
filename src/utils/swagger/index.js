import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import yaml from "js-yaml";
import fs from "fs";
import path from "path";
import { Log } from "../log.js";
import { getRoute } from "../get-route.js";
import { swaggerPath } from "../../config/env.js";

const __dirname = getRoute(import.meta.url);

const definitionPath = path.resolve(__dirname, "./definition.yaml");
const definition = yaml.load(fs.readFileSync(definitionPath, "utf8"));

definition.servers = [{ url: swaggerPath }];

const options = {
  definition,
  apis: ["./src/product.router.js", "./src/cart.router.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export const swaggerDocs = (app, port) => {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, { customCssUrl: "/css/swagger-ui.css" })
  );

  app.get("/docs.json", (_, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  Log.info(`Docs - available at ${port}/api-docs/`);
};
