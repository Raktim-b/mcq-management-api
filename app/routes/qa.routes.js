const express = require("express");
const authCheck = require("../middleware/auth");
const allowRoles = require("../middleware/allowRoles");
const qAController = require("../controller/q&a.controller");

const qaRouter = express.Router();

// Create Category
qaRouter.post(
  "/create-category",
  authCheck,
  allowRoles("admin"),
  qAController.createCategory,
);

// Get Category
qaRouter.get(
  "/get-category",
  authCheck,
  allowRoles("admin"),
  qAController.getCategory,
);
qaRouter.post(
  "/create-question",
  authCheck,
  allowRoles("admin"),
  qAController.createQuestion,
);
qaRouter.get(
  "/get-question",
  authCheck,
  allowRoles("admin"),
  qAController.getQuestions,
);
qaRouter.get(
  "/get-questionbycategory",
  authCheck,
  allowRoles("admin"),
  qAController.getQuestionsByCategory,
);
qaRouter.post("/submit-answer", authCheck, qAController.submitAnswer);

module.exports = qaRouter;
