import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mainRoute from "./routes/pageRoute.js";
import adminRoute from "./routes/adminRoute.js";
import { Database } from "./helpers/database/db.js";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
import session from "express-session";
import flash from "connect-flash";

const app = express();

// .ENV
dotenv.config({
  path: "./config/.env",
});

// PORT
const PORT = process.env.PORT;

// DB
Database.conntect();

// EJS
app.set("view engine", "ejs");

// FILEUPLOAD
app.use(fileUpload());

// STATIC FILES
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// FLASH
app.use(flash());

// SESSION
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 5000 },
    saveUninitialized: false,
    resave: false,
  })
);

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// ROUTES
app.use("/", mainRoute);
app.use("/admin", adminRoute);

// LISTEN
app.listen(PORT, () => console.log(`App started on : ${PORT}`));
