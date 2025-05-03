const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const { errorResponse } = require("../utils/responseHandler");

const generateToken = async (payload) => {
  return await jwt.sign(payload, process.env.JWT_SECRET);
};

const verifyToken = async (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) return errorResponse(res, "Unauthorize Access");

  const decoded = await jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded._id);
  next();
};

const verifySuperAdmin = async (req, res, next) => {
  if (req.user.role !== "superadmin")
    return errorResponse(res, "You don't have rights to access this api.");
  next();
};

const verifyAdmin = async (req, res, next) => {
  if (req.user.role !== "admin")
    return errorResponse(res, "You don't have rights to access this api.");
  next();
};

module.exports = { generateToken, verifyToken, verifySuperAdmin, verifyAdmin };
