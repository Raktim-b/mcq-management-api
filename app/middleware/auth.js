const jwt = require("jsonwebtoken");
const httpStatusCode = require("../utils/httpStatusCode");

const authCheck = (req, res, next) => {
  const token =
    req?.body?.token ||
    req?.query?.token ||
    req?.headers["x-access-token"] ||
    req?.headers["authorization"];

  if (!token) {
    return res.status(httpStatusCode.BAD_REQUEST).json({
      success: false,
      message: "Token is required for access this url",
    });
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode;
  } catch (error) {
    return res.status(httpStatusCode.BAD_REQUEST).json({
      success: false,
      message: "invalid token",
    });
  }

  return next();
};

module.exports = authCheck;
