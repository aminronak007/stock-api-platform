const successResponse = (
  res,
  data = [],
  message = "Success",
  stautusCode = 200
) => {
  return res.status(stautusCode).json({ success: true, message, data });
};

const errorResponse = (
  res,
  message = "Internal Server Error!",
  errors = {},
  stautusCode = 500
) => {
  return res.status(stautusCode).json({ success: true, message, errors });
};

module.exports = { successResponse, errorResponse };
