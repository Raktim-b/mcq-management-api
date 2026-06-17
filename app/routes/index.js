const express = require("express");
const authRoutes = require("./auth.routes");
const userRouter = require("./user.routes");
const qaRouter = require("./qa.routes");
const router = express.Router();

router.use("/auth", authRoutes);
router.use("/user", userRouter);
router.use("/qa", qaRouter);

module.exports = router;
