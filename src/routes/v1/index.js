/**
 * namnguyen
 */

import express from "express";
import { StatusCodes } from "http-status-codes";
import { authRouter } from "./authRoute";
import { storeRoute } from "./storeRoute";
import { ownerRoute } from "./ownerRouter";
import { freelancerRoute } from "./freelancerRouter";

const Router = express.Router();

//check APIs v1 status
Router.get("/status", (req, res) => {
  res.status(StatusCodes.OK).json({ message: "APIs V1 are ready to use" });
});

//User APIs
Router.use("/auth", authRouter);
//Store APIs
Router.use("/stores", storeRoute);
//Owner APIs
Router.use("/owners", ownerRoute);
//Freelancer APIs
Router.use("/freelancers", freelancerRoute);

export const APIs_V1 = Router;
