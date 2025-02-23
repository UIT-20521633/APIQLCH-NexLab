import express from "express";
import { storeController } from "~/controllers/storeController";
import { authMiddleware } from "~/middlewares/authMiddleware";
import { storeValidation } from "~/validations/storeValidation";

const Router = express.Router();

//Cho phép chủ cửa hàng tạo cửa hàng mới
Router.route("/").post(
  authMiddleware.isAuthorized,
  storeValidation.createStore,
  storeController.createStore
);

export const storeRoute = Router;
