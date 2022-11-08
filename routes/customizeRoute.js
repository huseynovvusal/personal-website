import express from "express";
import AdminController from "../controllers/adminController.js";

const router = express.Router();

// GET
router.get("/", AdminController.getCustomizePage);
router.post("/link", AdminController.addNewLink);
router.post("/link/delete/:id", AdminController.deleteLink);
router.post("/description", AdminController.editDescription);
router.post("/portfolio", AdminController.addNewProject);
router.post("/project/delete/:id", AdminController.deleteProject);
router.post("/blog", AdminController.addNewBlog);
router.post("/blog/delete/:id", AdminController.deleteBlog);

export default router;
