import Contact from "../models/ContactModel.js";
import Link from "../models/LinkModel.js";
import Description from "../models/DescriptionModel.js";
import Project from "../models/ProjectModel.js";
import Blog from "../models/BlogModel.js";
import Course from "../models/CourseModel.js";

class PageController {
  static async getIndexPage(req, res) {
    const links = await Link.find({});

    const descriptions = await Description.find({});

    res.render("index", {
      link: "index",
      links: links,
      descriptions: descriptions,
    });
  }
  static async getBlogPage(req, res) {
    const links = await Link.find({});
    const blogs = await Blog.find({});

    res.render("blog", { link: "blog", blogs: blogs, links: links });
  }
  static async getSingleBlogPage(req, res) {
    const blog = await Blog.findOne({ _id: req.params.id });

    res.render("single-blog", { link: "blog", blog: blog });
  }
  static async getSingleCoursePage(req, res) {
    const course = await Course.findOne({ _id: req.params.id });

    res.render("single-course", { link: "course", course: course });
  }

  static async getContactPage(req, res) {
    const links = await Link.find({});

    res.render("contact", {
      link: "contact",
      links: links,
    });
  }
  static async getPortfolioPage(req, res) {
    const links = await Link.find({});

    const projects = await Project.find({});

    res.render("portfolio", {
      link: "portfolio",
      links: links,
      projects: projects,
    });
  }
  static async getCoursesPage(req, res) {
    const links = await Link.find({});
    const courses = await Course.find({});

    res.render("courses", {
      link: "courses",
      links: links,
      courses: courses,
    });
  }
  static async getVideosPage(req, res) {
    const links = await Link.find({});

    res.render("videos", { link: "videos", links: links });
  }
  static async getAboutPage(req, res) {
    const links = await Link.find({});

    const descriptions = await Description.find({});

    res.render("about", {
      link: "about",
      links: links,
      descriptions: descriptions,
    });
  }
  static async postMessage(req, res) {
    try {
      const user = await Contact.create(req.body);

      res.redirect("/");
    } catch (err) {
      res.status(500).json({
        success: false,
        err,
      });
      console.log(err);
    }
  }
}

export default PageController;
