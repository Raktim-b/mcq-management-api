const express = require("express");
const authCheck = require("../middleware/auth");
const allowRoles = require("../middleware/allowRoles");
const userController = require("../controller/user.Controller");
const UserImage = require("../middleware/fileUploades");
const router = express.Router();

// Create User
router.post(
  "/create-user",
  UserImage.single("avatar"),
  userController.createUser,
);

// Verify
router.post("/verify", userController.verify);

// Get User
router.get(
  "/get-users",
  authCheck,
  allowRoles("admin"),
  userController.getUser,
);
router.get("/get-user", authCheck, userController.getUserById);

// Update User
router.put(
  "/update-user/:id",
  authCheck,
  allowRoles("admin"),
  userController.updateUser,
);

//Soft Delete User
router.delete(
  "/delete-user/:id",
  authCheck,
  allowRoles("admin"),
  userController.softDelete,
);

// Update Password
router.put("/change-password", authCheck, userController.changePassword);

module.exports = router;
