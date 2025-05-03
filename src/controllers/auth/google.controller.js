const { google } = require("googleapis");
const {
  errorResponse,
  successResponse,
} = require("../../utils/responseHandler");
const User = require("../../models/User.model");

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALLBACK_URL
);

const googleLogin = async (req, res) => {
  try {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "online",
      scope: ["profile", "email"],
      prompt: "consent",
    });

    res.redirect(authUrl);
  } catch (error) {
    console.log("error", error);
    return errorResponse(res, "Google Login failed");
  }
};

const googleCallback = async (req, res) => {
  try {
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get User info
    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: "v2",
    });

    const { data } = await oauth2.userinfo.get();
    const { email, given_name, family_name } = data;

    let user = await User.findOne({ email }).lean();

    if (!user) {
      user = await User.create({
        email,
        firstName: given_name,
        lastName: family_name,
      });
    }

    return successResponse(
      res,
      { ...user, ...data },
      "Google Login successful."
    );
  } catch (error) {
    console.log("error", error);
    return errorResponse(res, "Google Callback failed");
  }
};

module.exports = { googleLogin, googleCallback };
