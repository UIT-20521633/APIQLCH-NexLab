import Joi from "joi";
import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/ApiError";

const createStore = async (req, res, next) => {
  const correctCondition = Joi.object({
    name: Joi.string().required(),
    address: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().required(),
    logo: Joi.string().optional(),
  });

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(
      new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    );
  }
};

export const storeValidation = {
  createStore,
};
