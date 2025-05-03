const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));

const limiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);
app.use(helmet());

// Auth Routes
const authRoutes = require("./routes/auth/auth.routes");
const googleAuthRoutes = require("./routes/auth/google.routes");
const githubAuthRoutes = require("./routes/auth/github.routes");

app.use("/api/v1/auth", authRoutes);
app.use("/google", googleAuthRoutes);
app.use("/github", githubAuthRoutes);

// Super Admin Routes
const superAdminUserRoutes = require("./routes/superadmin/user.routes");
const superAdminSubscriptionRoutes = require("./routes/superadmin/subscriptions.routes");

app.use("/api/v1/super/user", superAdminUserRoutes);
app.use("/api/v1/super/subscription", superAdminSubscriptionRoutes);

// Admin Routes
const adminRoutes = require("./routes/admin/user.routes");
app.use("/api/v1/admin/user", adminRoutes);

// User Routes
const userSubscriptionRoutes = require("./routes/users/subscriptions.routes");
const userStockApiRoutes = require("./routes/users/stockapis.routes");

app.use("/api/v1/user/subscription", userSubscriptionRoutes);
app.use("/api/v1/user/stock", userStockApiRoutes);

module.exports = app;
