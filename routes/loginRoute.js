import express from "express";
import AuthMiddleware from "../middlewares/authMiddleware.js";
import AdminController from "../controllers/adminController.js";

const router = express.Router();

router.get("/", AuthMiddleware.isNotLogined, AdminController.getLoginPage);
router.post("/", AuthMiddleware.isNotLogined, AdminController.loginUser);
router.post("/verification/otp/:id", AdminController.verification);
// router.post("/verification/:id", AdminController.postVerificationPage);
// router.get(
//   "/verification/",
//   AuthMiddleware.isNotLogined,
//   AdminController.getVerificationPage
// );

export default router;
