const User = require("../../models/User.model");
const messages = require("../../utils/messages");
const {
  errorResponse,
  successResponse,
} = require("../../utils/responseHandler");
const { sanitizeUserData } = require("../../utils/sanitizeData");
const bcrypt = require("bcrypt");

const createUser = async (req, res) => {
  try {
    const { errors, data } = sanitizeUserData(req.body);

    if (errors.length > 0)
      return errorResponse(res, messages.VALIDATION, errors);

    if (data.role === "admin" || data.role === "superadmin")
      return errorResponse(res, "You don't have rights to create admin user");

    data.password = await bcrypt.hash(data.password, 10);
    const createUser = new User(data);
    const result = await createUser.save();

    return successResponse(res, result, "User created successfully.");
  } catch (error) {
    console.log("Error", error);
    return errorResponse(res, messages.ERROR);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const result = await User.find({ role: "user" }).lean();
    return successResponse(res, result, "Users list fetched successfully.");
  } catch (error) {
    console.log("Error", error);
    return errorResponse(res, messages.ERROR);
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.userId;
    const result = await User.findOne({ _id: userId }).lean();
    return successResponse(res, result, "Users details fetched successfully.");
  } catch (error) {
    console.log("Error", error);
    return errorResponse(res, messages.ERROR);
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { errors, data } = sanitizeUserData(req.body);

    if (errors.length > 0)
      return errorResponse(res, messages.VALIDATION, errors);

    if (data.role === "admin" || data.role === "superadmin")
      return errorResponse(res, "You don't have rights to update admin user");

    if ("email" in data) {
      delete data.email;
    }

    data.password = await bcrypt.hash(data.password, 10);
    const result = await User.findOneAndUpdate(
      { _id: userId },
      { $set: data },
      { new: true }
    );

    if (!result) return errorResponse(res, "User not found!");

    return successResponse(res, result, "User details updated successfully.");
  } catch (error) {
    console.log("Error", error);
    return errorResponse(res, messages.ERROR);
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findOne({ _id: userId });

    if (user.role === "admin" || user.role === "superadmin")
      return errorResponse(res, "You don't have rights to delete admin user");

    const result = await User.findOneAndDelete({ _id: userId });
    return successResponse(res, result, "User deleted successfully.");
  } catch (error) {
    console.log("Error", error);
    return errorResponse(res, messages.ERROR);
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
