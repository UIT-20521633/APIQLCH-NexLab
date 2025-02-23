import { StatusCodes } from "http-status-codes";
import AppDataSource from "~/config/database";

const sendJobRequest = async (req, res, next) => {
  try {
    const { freelancerId, storeId } = req.body;
    const jobRequestRepository = AppDataSource.getRepository("job_requests");
    const jobRequest = jobRequestRepository.create({
      freelancerId,
      storeId,
      status: "pending",
    });
    const resInvitation = await jobRequestRepository.save(jobRequest);
    res.status(StatusCodes.CREATED).json(resInvitation);
  } catch (error) {
    next(error);
  }
};

export const freelancerController = {
  sendJobRequest,
};
