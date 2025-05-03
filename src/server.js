require("dotenv").config();
const app = require("./app");
const connectDb = require("./config/db.config");
const initSuperAdmin = require("./utils/initSuperAdmin");

connectDb()
  .then(() => {
    console.log("Connected to Database");
    const port = process.env.PORT || 8082;
    app.listen(port, () => {
      initSuperAdmin();
      console.log(`Server listening on port: ${port}`);
    });
  })
  .catch((error) => {
    console.log("Error while connecting database", error.message);
  });
