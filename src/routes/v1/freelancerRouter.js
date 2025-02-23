import express from "express";
import { freelancerController } from "~/controllers/freelancerController";
import { authMiddleware } from "~/middlewares/authMiddleware";
import { freelancerValidation } from "~/validations/freelancerValidation";

const Router = express.Router();

// Gửi yêu cầu làm việc đến cửa hàng.
Router.route("/job-requests").post(
  authMiddleware.isAuthorized,
  freelancerValidation.sendJobRequest,
  freelancerController.sendJobRequest
);

export const freelancerRoute = Router;
