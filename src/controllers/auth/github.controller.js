const qs = require("querystring");
const {
  errorResponse,
  successResponse,
} = require("../../utils/responseHandler");
const axios = require("axios");
const User = require("../../models/User.model");

const githubLogin = async (req, res) => {
  try {
    const authUrl = `https://github.com/login/oauth/authorize?${qs.stringify({
      client_id: process.env.GIHUB_CLIENT_ID,
      redirect_uri: process.env.GIHUB_CALLBACK_URL,
      scope: "user:email",
    })}`;

    res.redirect(authUrl);
  } catch (error) {
    console.log("Error", error);
    return errorResponse(res, "Github Login failed.");
  }
};

const githubCallback = async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) return errorResponse(res, "Authorization code missing");

    const tokenRes = await axios.post(
      `https://github.com/login/oauth/access_token`,
      {
        client_id: process.env.GIHUB_CLIENT_ID,
        redirect_uri: process.env.GIHUB_CALLBACK_URL,
        client_secret: process.env.GIHUB_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: "application/json" } }
    );
    const { access_token } = tokenRes.data;
    const userRes = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    return successResponse(res, userRes.data, "Github Login Successful.");
  } catch (error) {
    console.log("Error", error);
    return errorResponse(res, "Github Callback failed.");
  }
};

module.exports = { githubLogin, githubCallback };
