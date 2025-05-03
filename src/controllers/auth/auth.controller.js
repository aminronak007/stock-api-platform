const { generateToken } = require("../../middlewares/jwt");
const User = require("../../models/User.model");
const messages = require("../../utils/messages");
const logger = require("../../utils/logger");

const {
  errorResponse,
  successResponse,
} = require("../../utils/responseHandler");
const { sanitizeLoginData } = require("../../utils/sanitizeData");
const bcrypt = require("bcrypt");

const login = async (req, res) => {
  try {
    const { errors, data } = sanitizeLoginData(req.body);

    if (errors.length > 0)
      return errorResponse(res, messages.VALIDATION, errors);

    const checkEmail = await User.findOne({ email: data.email })
      .select("+password")
      .lean();

    if (!checkEmail) return errorResponse(res, "Invalid Credentials");

    const checkPassword = await bcrypt.compare(
      data.password,
      checkEmail.password
    );

    if (!checkPassword) return errorResponse(res, "Invalid Credetials");

    const token = await generateToken({
      _id: checkEmail._id,
      email: checkEmail.email,
    });

    const { password, ...userData } = checkEmail;
    const result = { ...userData, token };

    logger.info("Login Successfully.");
    return successResponse(res, result, "You are login Successfully.");
  } catch (error) {
    console.log("Error", error);
    return errorResponse(res, messages.ERROR);
  }
};

module.exports = { login };
