const User = require("../models/User.model");
const bcrypt = require("bcrypt");

const initSuperAdmin = async () => {
  try {
    const checkSuperAdmin = await User.findOne({ role: "superadmin" });
    if (!checkSuperAdmin) {
      const password = await bcrypt.hash(process.env.SUPER_ADMIN_PASS, 10);
      const createSuperAdmin = new User({
        firstName: "Super",
        lastName: "Admin",
        email: "superadmin@yopmail.com",
        password,
        role: "superadmin",
      });

      await createSuperAdmin.save();
    }
  } catch (error) {
    console.log("Error", error);
  }
};

module.exports = initSuperAdmin;
