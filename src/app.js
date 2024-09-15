import express from "express";
import path from "path";
import bodyParser from "body-parser";
import { create } from "express-handlebars";
import cookieParser from "cookie-parser";

import { initializePassport } from "./config/passport.js";
import { appPort } from "./config/env.js";
import { swaggerDocs } from "./utils/swagger/index.js";
import { getRoute } from "./utils/get-route.js";
import { dbConnect, dbError } from "./config/db.js";

import usersRouter from "./routes/user.router.js";
import productsRouter from "./routes/product.router.js";
import cartsRouter from "./routes/cart.router.js";
import staticRouter from "./routes/static.router.js";

const PORT = appPort || 8080;
const __dirname = getRoute(import.meta.url);
const app = express();
const hbs = create({
  extname: "hbs",
  partialsDir: path.join(__dirname, "views", "partials"),
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

dbConnect();
initializePassport();
dbError;

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

app.use("/api/session", usersRouter);
app.use("/api/product", productsRouter);
app.use("/api/cart", cartsRouter);
app.use("/views", staticRouter);

swaggerDocs(app, PORT, __dirname);

export { app, PORT };
