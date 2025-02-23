import express from "express";
import { ownerController } from "~/controllers/ownerController";
import { authMiddleware } from "~/middlewares/authMiddleware";
import { ownerValidation } from "~/validations/ownerValidation";

const Router = express.Router();

// Lấy danh sách cửa hàng mà của chủ cửa hàng.
Router.route("/stores").get(
  authMiddleware.isAuthorized,
  ownerController.getStores
);
//Phản hồi yêu cầu làm việc (chấp nhận/từ chối)
Router.route("/job-requests/:requestId").put(
  authMiddleware.isAuthorized,
  ownerValidation.updateJobRequest,
  ownerController.updateJobRequest
);

export const ownerRoute = Router;
