const Subscription = require("../../models/Subscription.model");
const User = require("../../models/User.model");
const messages = require("../../utils/messages");
const {
  errorResponse,
  successResponse,
} = require("../../utils/responseHandler");
const axios = require("axios");

const getAccessToStockApi = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id }).lean();
    const plan = await Subscription.findOne({ name: "Basic" }).lean();
    if (user?.plan === "Basic") {
      const stockApi = {
        stock_api_1: `${process.env.BACKEND_BASE_URL}/api/v1/user/stock/1`,
      };
      return successResponse(res, stockApi);
    } else if (user?.plan === "Standard") {
      const stockApi = {
        stock_api_1: `${process.env.BACKEND_BASE_URL}/api/v1/user/stock/1`,
        stock_api_2: `${process.env.BACKEND_BASE_URL}/api/v1/user/stock/2`,
      };
      return successResponse(res, stockApi);
    } else if (user?.plan === "Premium") {
      const stockApi = {
        stock_api_1: `${process.env.BACKEND_BASE_URL}/api/v1/user/stock/1`,
        stock_api_2: `${process.env.BACKEND_BASE_URL}/api/v1/user/stock/2`,
        stock_api_3: `${process.env.BACKEND_BASE_URL}/api/v1/user/stock/3`,
      };
      return successResponse(res, stockApi);
    }

    return errorResponse(
      res,
      "Please upgrade to paid version to get access to our stock APIs",
      403
    );
  } catch (error) {
    console.log("error", error);
    return errorResponse(res, messages.ERROR);
  }
};

const stockAPI = async (req, res) => {
  try {
    const apiName = req.params.id;
    let stockApi = null;

    console.log("apiName", apiName);

    if (apiName === "1") {
      stockApi = process.env.STOCK_API_1;
    } else if (apiName === "2") {
      stockApi = process.env.STOCK_API_2;
    } else if (apiName === "3") {
      stockApi = process.env.STOCK_API_3;
    }

    console.log("stockApi", stockApi);

    if (!stockApi)
      return errorResponse(res, "You don't have rights to access the api!");

    const response = await axios.get(stockApi, {
      headers: { "Content-Type": "application/json" },
    });
    const result = response.data;

    return successResponse(res, result);
  } catch (error) {
    console.log("Error", error);
    return errorResponse(res, messages.ERROR);
  }
};

module.exports = { getAccessToStockApi, stockAPI };
