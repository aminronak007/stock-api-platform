const validator = require("validator");

const sanitizeLoginData = (input) => {
  const errors = [];

  const data = {
    email: validator.normalizeEmail(input.email?.trim() || ""),
    password: input.password.trim() || "",
  };

  if (!validator.isEmail(data.email)) errors.push("Email is invalid!");
  if (!validator.isLength(data.password, { min: 8 }))
    errors.push("Password must be atleast 8 characters!");

  return { errors, data };
};

const sanitizeUserData = (input) => {
  try {
    const errors = [];
    const data = {
      firstName: validator.escape(input.firstName?.trim() || ""),
      lastName: validator.escape(input.lastName?.trim() || ""),
      email: validator.normalizeEmail(input.email?.trim() || ""),
      password: input.password.trim() || "",
      role: validator.escape(input.role?.trim() || ""),
    };

    if (!data.firstName) errors.push("First name is required!");
    if (!data.lastName) errors.push("Last name is required!");
    if (!validator.isEmail(data.email)) errors.push("Email is invalid!");
    if (!validator.isLength(data.password, { min: 8 }))
      errors.push("Password must be atleast 8 characters!");
    if (!data.role) errors.push("Role is required!");

    return { errors, data };
  } catch (error) {
    console.log("Error validation", error);
  }
};

module.exports = { sanitizeLoginData, sanitizeUserData };
