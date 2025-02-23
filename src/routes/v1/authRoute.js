import express from "express";
import { userValidation } from "~/validations/userValidation";
import { userController } from "~/controllers/userController";

const Router = express.Router();

Router.route("/login").post(userValidation.login, userController.login);
Router.route("/register").post(
  userValidation.createNew,
  userController.createNew
);
Router.route("/verify").put(
  userValidation.verifyAccount,
  userController.verifyAccount
);

export const authRouter = Router;
