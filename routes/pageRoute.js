import express from "express";
import PageController from "../controllers/pageController.js";

const router = express.Router();

// GET
router.get("/", PageController.getIndexPage);
router.get("/blog", PageController.getBlogPage);
router.get("/blogs/:id", PageController.getSingleBlogPage);
router.get("/portfolio", PageController.getPortfolioPage);
router.get("/contact", PageController.getContactPage);
router.get("/videos", PageController.getVideosPage);
router.get("/about", PageController.getAboutPage);
router.get("/courses", PageController.getCoursesPage);
router.get("/courses/:id", PageController.getSingleCoursePage);


// POST
router.post("/contact", PageController.postMessage);

export default router;
