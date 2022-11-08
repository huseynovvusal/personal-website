import express from "express";
import AdminController from "../controllers/adminController.js";
import customizeRoute from "./customizeRoute.js";
import messagesRoute from "./messagesRoute.js";
import loginRoute from "./loginRoute.js";
import AuthMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// router.get("*", AuthMiddleware.authenticateToken);
// router.post("*", AuthMiddleware.authenticateToken);

// GET
router.get("/", AuthMiddleware.authenticateToken, AdminController.getIndexPage);
router.get(
  "/messages",
  AuthMiddleware.authenticateToken,
  AdminController.getMessagesPage
);
router.post("/messages/delete/:id", AdminController.deleteMessage);
router.get(
  "/blog",
  AuthMiddleware.authenticateToken,
  AdminController.getBlogPage
);
router.get(
  "/portfolio",
  AuthMiddleware.authenticateToken,
  AdminController.getPortfolioPage
);
router.get(
  "/videos",
  AuthMiddleware.authenticateToken,
  AdminController.getVideosPage
);
router.get(
  "/settings",
  AuthMiddleware.authenticateToken,
  AdminController.getSettingsPage
);

router.use("/customize", AuthMiddleware.authenticateToken, customizeRoute);
router.use("/messages", AuthMiddleware.authenticateToken, messagesRoute);
router.use("/login", loginRoute);

export default router;
