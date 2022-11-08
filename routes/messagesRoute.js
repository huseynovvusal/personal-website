import express from "express";
import AdminController from "../controllers/adminController.js";

const router = express.Router();

// GET
router.get("/", AdminController.getMessagesPage);
router.post("/delete/:id", AdminController.deleteMessage);

export default router;
