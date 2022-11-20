import Contact from "../models/ContactModel.js";
import Link from "../models/LinkModel.js";
import Description from "../models/DescriptionModel.js";
import fs from "fs";
import Project from "../models/ProjectModel.js";
import User from "../models/UserModel.js";
import Blog from "../models/BlogModel.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import path from "path";
import Course from "../models/CourseModel.js";

const __dirname = path.resolve();

class AdminController {
  static getIndexPage(req, res) {
    res.render("admin", {
      link: "index",
    });
  }
  static async getCoursesPage(req, res) {
    try{

      const courses = await Course.find({});

      res.render("admin", {
        link: "courses",
        courses : courses
      });

    }catch (error) {
      req.flash("error", "Xəta baş verdi");
      res.redirect("/admin/courses");
      console.log(error);
    }
  }
  static async getMessagesPage(req, res) {
    try {
      const contacts = await Contact.find({});

      await contacts.reverse();

      res.render("admin", { link: "messages", contacts: contacts });
    } catch (error) {
      res.render("admin", {
        link: "messages",
        error: {
          success: false,
          message: "Some error occurred",
        },
      });
    }
  }
  static async deleteMessage(req, res) {
    try {
      const contact = await Contact.deleteOne({ _id: req.params.id });

      res.redirect("/admin/messages");
    } catch (error) {
      res.render("admin", {
        link: "messages",
        error: {
          success: false,
          message: "Some error occurred",
        },
      });
    }
  }
  static async getCustomizePage(req, res) {
    try {
      const links = await Link.find({});

      const descriptions = await Description.find({});

      res.render("admin", {
        link: "customize",
        links: links,
        descriptions: descriptions,
      });
    } catch (err) {
      res.render("admin", {
        link: "customize",
        error: {
          success: false,
          message: "Some error occurred",
        },
      });
    }
  }
  static async getLoginPage(req, res) {
    try {
      const user = await User.findOne({});

      res.render("login", { user: user });
    } catch (err) {
      res.render("login", {
        error: {
          success: false,
          message: "Some error occurred",
        },
      });
    }
  }
  static async getVerificationPage(req, res) {
    try {
      const user = await User.findOne({});

      res.render("verification", { user: user });
    } catch (err) {
      res.flash("error", "Some errors occured");
      res.render("verification");
    }
  }
  static async postVerification(req, res, user) {
    try {
      const code = await AdminController.createOTPVerificationCode();

      bcrypt.hash(code, 10).then(async (hash) => {
        await res.cookie("email_verification", hash, {
          httpOnly: true,
          maxAge: 1000 * 60,
        });

        await AdminController.sendEmail(user.email, code);
      });
    } catch (error) {
      console.log(error);
      res.flash("error", "Xəta baş verdi");
    }
  }

/*   static async createUser(req, res) {
    try {
      const user = await User.create(req.body);

      console.log("user created");
    } catch (error) {
      if (error.code == 11000) {
        console.log("This email has already been registered.");
      }
    }
  } */
  
  
  static async addCourse(req,res){
    try {
      const course_image = req.files.course_image;

      await course_image.mv(
        `${__dirname}/public/img/courseImages/${course_image.name}`
      );

      const course = await Course.create({
        course_image : course_image.name,
        ...req.body
      });

      req.flash("success", `${req.body.course_name} uğurla paylaşıldı`);
      res.redirect("/admin/courses");

    } catch (error) {
      req.flash("error", "Xəta baş verdi");
      res.redirect("/admin/courses");
      console.log(error);
    }
  }
  static async deleteCourse(req,res){
    try {
      const course = await Course.findOne({_id : req.params.id});

      const course_image = course.course_image;
      const course_name = course.course_name;

      fs.unlinkSync(__dirname + "/public/img/courseImages/" + course_image);

      course.remove();

      req.flash("success", `${course_name} uğurla silindi`);
      res.redirect("/admin/courses");


    } catch (error) {
      req.flash("error", "Xəta baş verdi");
      res.redirect("/admin/courses");
      console.log(error);
    }
  }
  static async loginUser(req, res) {
    try {
      //! My Password vslh_admin(07)&._website

      const { email, password } = await req.body;

      const user = await User.findOne({ email: email });

      if (user) {
        let same = await bcrypt.compare(password, user.password);

        if (same) {
          AdminController.getVerificationPage(req, res);

          await AdminController.postVerification(req, res, user);
        } else {
          req.flash("error", "Yalnış Email və ya Şifrə");
          res.redirect("/admin/login");
        }
      } else {
        req.flash("error", "Yalnış Email və ya Şifrə");
        res.redirect("/admin/login");
      }
    } catch (error) {
      req.flash("error", "Xəta baş verdi");
      res.redirect("/admin/login");
    }
  }

  static createToken(userId) {
    return jwt.sign({ userId: userId }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });
  }

  static async verification(req, res) {
    try {
      const code = await req.cookies.email_verification;
      const userCode = await req.body.email_verification_code;
      const user = User.findOne({ _id: req.params.id });

      let same = await bcrypt.compare(userCode, code);

      res.clearCookie("email_verification");

      if (same) {
        const token = AdminController.createToken(req.params.id);

        res.cookie("jwt", token, {
          httpOnly: true,
          maxAge: 100 * 60 * 60 * 24 * 3, // 1 day
        });

        req.flash("success", "Admin olaraq giriş olundu");
        res.redirect("/admin");
      } else {
        req.flash("error", "Yalnış doğrulama kodu");
        res.redirect("/admin/login");
      }
    } catch (error) {
      req.flash(
        "error",
        "Xahiş olunur yenidən cəhd edin, sizin 4 rəqəmli doğrulama kodunuzun vaxtı keçib."
      );
      req.redirect("/admin/login");
    }
  }

  static async createOTPVerificationCode() {
    const code = Math.floor(1000 + Math.random() * 9000).toString();

    return code;
  }

  static async sendEmail(email, code) {
    const transporter = nodemailer.createTransport({
      secure : true,
      host: "smtp.gmail.com",
      port : 465,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    var mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Admin Verification",
      // text: `Your 4 digits code : ${code}`,
      html: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <style>
            @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap");
          
            body {
              padding: 0;
              margin: 0;
              font-family: "Poppins", sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              color: #202020;
            }
          
            h1 {
              font-size: 1.5rem;
            }
          
            span {
              font-size: 1.5rem;
              font-weight: 600;
              background: rgb(65, 108, 158);
              color: white;
              border-radius: 0.5rem;
              padding: 0 1rem;
            }
          
            p {
              color: red;
            }
          </style>
        </head>
        <body>
          <h1>Your 4 digits code :</h1>
          <span>${code}</span>
          <p>Do not share this email with anybody!</p>
        </body>
      </html>

      `,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent");
      }
    });
  }

  static async getBlogPage(req, res) {
    try {
      const blogs = await Blog.find({});

      res.render("admin", {
        link: "blog",
        blogs: blogs,
      });
    } catch (err) {
      res.flash("error", "Some errors occured");
      res.render("admin", {
        link: "blog",
      });
    }
  }
  static async addNewBlog(req, res) {
    try {
      console.log(req.body);

      const blog_image = await req.files.blog_image;

      await blog_image.mv(
        `${__dirname}/public/img/blogImages/${blog_image.name}`
      );

      const blog = await Blog.create({
        blog_image: blog_image.name,
        ...req.body,
      });

      req.flash("success", "Your blog is created successfully");
      res.redirect("/admin/blog");
    } catch (error) {
      req.flash("error", "Some errors occured!");
      res.redirect("/admin/blog");
    }
  }
  static async deleteBlog(req, res) {
    try {
      const blog = await Blog.findOne({ _id: req.params.id });

      const image_name = blog.blog_image;

      const blog_name = blog.blog_name;

      fs.unlinkSync(__dirname + "/public/img/blogImages/" + image_name);

      blog.remove();

      req.flash("success", `${blog_name} is deleted successfully`);
      res.redirect("/admin/blog");
    } catch (error) {
      if (error.errno == -4058) {
        const blog = await Blog.findOne({ _id: req.params.id });

        const blog_name = blog.blog_name;

        blog.remove();

        req.flash("success", `${blog_name} is deleted successfully`);
        res.redirect("/admin/blog");
      } else {
        req.flash("error", "Some errors occured!");
        res.redirect("/admin/blog");
      }
    }
  }
  static async getPortfolioPage(req, res) {
    const projects = await Project.find({});

    res.render("admin", { link: "portfolio", projects: projects });
  }
  static getVideosPage(req, res) {
    res.render("admin", { link: "videos" });
  }
  static getSettingsPage(req, res) {
    res.render("admin", { link: "settings" });
  }
  static async addNewLink(req, res) {
    try {
      const link_image = await req.files.link_image;

      await link_image.mv(
        `${__dirname}/public/img/linkImages/${link_image.name}`
      );

      const link = await Link.create({
        link_image: link_image.name,
        ...req.body,
      });

      req.flash("success", `${req.body.link_name} is added successfully`);
      res.redirect("/admin/customize");
    } catch (error) {
      req.flash("success", "Some error occurred");
      res.redirect("/admin/customize");
    }
  }
  static async deleteLink(req, res) {
    try {
      const link = await Link.findOne({ _id: req.params.id });

      const image_name = link.link_image;

      await link.remove();

      fs.unlinkSync(__dirname + "/public/img/linkImages/" + image_name);

      req.flash("success", `${link.link_name} is deleted successfully`);
      res.redirect("/admin/customize");
    } catch (error) {
      req.flash("error", "Some error occurred");
      res.redirect("/admin/customize");
    }
  }
  static async editDescription(req, res) {
    try {
      const descriptions = await Description.find({});

      if (!descriptions.length) {
        const description = await Description.create(req.body);
      } else {
        const description = await Description.findOneAndUpdate({}, req.body);
      }

      req.flash("success", "Content updated");
      res.redirect("/admin/customize");
    } catch (error) {
      req.flash("error", "Some error occurred");
      res.redirect("/admin/customize");
    }
  }
  static async addNewProject(req, res) {
    try {
      const project_image = await req.files.project_image;

      await project_image.mv(
        `${__dirname}/public/img/projects/${project_image.name}`
      );

      const project = await Project.create({
        project_image: project_image.name,
        ...req.body,
      });

      req.flash("success", `${req.body.project_name} added successfully`);
      res.redirect("/admin/portfolio");
    } catch (error) {
      req.flash("error", "Some error occurred");
      res.redirect("/admin/portfolio");
    }
  }
  static async deleteProject(req, res) {
    try {
      const project = await Project.findOne({ _id: req.params.id });

      const project_name = project.project_name;

      await fs.unlinkSync(
        __dirname + "/public/img/projects/" + project.project_image
      );

      await project.remove();

      req.flash("success", `${project_name} deleted successfully`);
      res.redirect("/admin/portfolio");
    } catch (error) {
      res.json({
        success: false,
        error,
      });
      req.flash("success", "Some error occured");
      res.redirect("/admin/portfolio");
    }
  }
}

export default AdminController;
