const UserModel = require("../model/userModel");
const httpStatusCode = require("../utils/httpStatusCode");
const bcrypt = require("bcrypt");
const cloudinary = require("../config/cloudinary");
const sendEmail = require("../utils/sendEmail");
const emailVerificationModel = require("../model/otpModel");

class UserController {
  //  CREATE USER

  async createUser(req, res) {
    try {
      const { name, email, password, phone } = req.body;
      if (!name || !email || !password) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "All fields are required",
        });
      }
      const existingUser = await UserModel.findOne({
        email,
      });
      if (existingUser) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "User already exists",
        });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const userData = new UserModel({
        name,
        email,
        password: hashedPassword,
        phone,
      });
      if (req.file) {
        userData.avatar = req.file.path;
        userData.public_id = req.file.filename;
      }
      const result = await userData.save();
      await sendEmail(result, password);
      return res.status(httpStatusCode.CREATED).json({
        success: true,
        message: "Registered Successfully",
        data: result,
      });
    } catch (error) {
      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
  // Verify
  async verify(req, res) {
    try {
      const { email, otp } = req.body;
      if (!email || !otp) {
        return res
          .status(httpStatusCode.BAD_REQUEST)
          .json({ status: false, message: "All fields are required" });
      }
      const existingUser = await UserModel.findOne({ email });
      if (!existingUser) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "invalid credential",
        });
      }
      if (existingUser.isVarified) {
        return res
          .status(httpStatusCode.BAD_REQUEST)
          .json({ status: false, message: "Email is already verified" });
      }
      const emailVerification = await emailVerificationModel.findOne({
        userId: existingUser._id,
        otp,
      });
      if (!emailVerification) {
        if (!existingUser.isVarified) {
          await sendEmail(req, existingUser);
          return res.status(httpStatusCode.BAD_REQUEST).json({
            status: false,
            message: "Invalid OTP, new OTP sent to your email",
          });
        }
        return res
          .status(httpStatusCode.BAD_REQUEST)
          .json({ status: false, message: "Invalid OTP" });
      }
      const currentTime = new Date();
      const expirationTime = new Date(
        emailVerification.createdAt.getTime() + 15 * 60 * 1000,
      );
      if (currentTime > expirationTime) {
        // OTP expired, send new OTP
        await sendEmail(req, existingUser);
        return res.status(httpStatusCode.BAD_REQUEST).json({
          status: "failed",
          message: "OTP expired, new OTP sent to your email",
        });
      }
      existingUser.isVarified = true;
      await existingUser.save();
      await emailVerificationModel.deleteMany({ userId: existingUser._id });
      return res
        .status(httpStatusCode.OK)
        .json({ status: true, message: "Email verified successfully" });
    } catch (error) {
      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
  //  GET USER

  async getUser(req, res) {
    try {
      const users = await UserModel.find({
        isDeleted: false,
      });
      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "Users fetched successfully",
        data: users,
      });
    } catch (error) {
      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
  //  GET USER BY ID
  async getUserById(req, res) {
    try {
      const userId = req.user.id;

      const user = await UserModel.findOne({
        _id: userId,
        isDeleted: false,
      });

      if (!user) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "User not found",
        });
      }

      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "User fetched successfully",
        data: user,
      });
    } catch (error) {
      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  //  UPDATE USER

  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const existUser = await UserModel.findById(id);
      if (!existUser) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "User not found",
        });
      }
      let updateObj = {
        ...req.body,
      };
      if (req.body && req.body.password) {
        const salt = await bcrypt.genSalt(10);
        updateObj.password = await bcrypt.hash(req.body.password, salt);
      }
      if (req.file) {
        if (existUser.public_id) {
          await cloudinary.uploader.destroy(existUser.public_id);
        }
        updateObj.avatar = req.file.path;
        updateObj.public_id = req.file.filename;
      }
      const updatedUser = await UserModel.findByIdAndUpdate(id, updateObj, {
        new: true,
      });
      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "User updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  //  SOFT DELETE

  async softDelete(req, res) {
    try {
      const { id } = req.params;
      const existUser = await UserModel.findById(id);
      if (!existUser) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "User not found",
        });
      }
      if (existUser.public_id) {
        await cloudinary.uploader.destroy(existUser.public_id);
      }
      const deletedUser = await UserModel.findByIdAndUpdate(
        id,
        {
          isDeleted: true,
        },
        {
          new: true,
        },
      );
      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "User deleted successfully",
        data: deletedUser,
      });
    } catch (error) {
      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
  async changePassword(req, res) {
    try {
      const userId = req.user.id;
      const { oldPassword, newPassword } = req.body;
      if (!oldPassword || !newPassword) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "All fields are required",
        });
      }
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "User not found",
        });
      }
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          status: false,
          message: "Wrong password",
        });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      const result = await UserModel.findByIdAndUpdate(
        userId,
        {
          password: hashedPassword,
        },
        { new: true },
      );
      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "Password changed successfully",
      });
    } catch (error) {
      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new UserController();
