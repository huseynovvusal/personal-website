import jwt from "jsonwebtoken";

class AuthMiddleware {
  static async authenticateToken(req, res, next) {
    try {
      const token = await req.cookies.jwt;

      if (token) {
        // console.log(jwt.decode(token));
        jwt.verify(token, process.env.JWT_SECRET, (err) => {
          if (err) {
            console.log("JWT ERROR::" + err.message);
            res.redirect("/admin/login");
          } else {
            next();
          }
        });
      } else {
        res.redirect("/admin/login");
      }
    } catch (err) {
      console.log(err);
      res.redirect("/admin/login");
    }
  }
  static async isNotLogined(req, res, next) {
    try {
      const token = await req.cookies.jwt;

      if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err) => {
          if (err) {
            console.log("JWT ERROR" + err.message);
            next();
          } else {
            res.redirect("/admin");
          }
        });
      } else {
        next();
      }
    } catch (error) {
      res.json({
        success: false,
        error: error,
      });
    }
  }
}

export default AuthMiddleware;
