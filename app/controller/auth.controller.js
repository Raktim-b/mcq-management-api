const UserModel = require("../model/userModel");
const httpStatusCode = require("../utils/httpStatusCode");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
class AuthController {
  async adminReg(req, res) {
    try {
      const { name, email, password } = req.body;
      const existingAdmin = await UserModel.findOne({
        role: "admin",
      });
      if (existingAdmin) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          status: false,
          message: "Admin already exist",
        });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const admin = new UserModel({
        name,
        email,
        password: hashedPassword,
        role: "admin",
      });

      const result = await admin.save();
      if (result) {
        return res.status(httpStatusCode.CREATED).json({
          success: true,
          message: "Registered Successfully",
          data: result,
        });
      }
    } catch (error) {
      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
  async logIn(req, res) {
    try {
      const { email, password } = req.body;

      const user = await UserModel.findOne({
        email,
        isDeleted: false,
      });
      if (!user) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "User not found",
        });
      }
      const checkPassword = await bcrypt.compare(password, user.password);
      if (!checkPassword) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          status: false,
          message: "Wrong password",
        });
      }
      const token = jwt.sign(
        {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" },
      );
      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "User Logedin Successfully",
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
        token: token,
      });
    } catch (error) {
      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
  async logOut(req, res) {
    try {
      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
}
module.exports = new AuthController();
