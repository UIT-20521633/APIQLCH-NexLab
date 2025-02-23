/* eslint-disable no-useless-catch */
import { StatusCodes } from "http-status-codes";
import AppDataSource from "~/config/database";

const getStores = async (req, res) => {
  try {
    const storeRepository = AppDataSource.getRepository("stores");
    //Kiểm tra xem user tạo cửa hàng là owner hay không
    const userRepository = AppDataSource.getRepository("users");
    const user = await userRepository.findOne({
      where: { id: req.jwtDecoded._id },
    });
    if (user.role !== "owner") {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: "Only owner can get store!" });
    }
    // Lấy danh sách cửa hàng theo ownerId từ token
    const stores = await storeRepository.find({
      where: { ownerId: req.jwtDecoded._id },
    });

    res.status(StatusCodes.OK).json(stores);
  } catch (error) {
    throw error;
  }
};

const updateJobRequest = async (req, res) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const { requestId } = req.params;
    const { status } = req.body;
    //Kiểm tra xem user tạo cửa hàng là owner hay không owner của cửa hàng mà job request đó gửi đến không
    const userRepository = AppDataSource.getRepository("users");
    const user = await userRepository.findOne({
      where: { id: req.jwtDecoded._id },
    });
    //lấy danh sách cửa hàng của owner
    const storeRepository = AppDataSource.getRepository("stores");
    const stores = await storeRepository.find({
      where: { ownerId: req.jwtDecoded._id },
    });
    //map ra mảng id của cửa hàng với job request
    const storeIds = stores.map((store) => store.id);
    const jobRequestRepository = AppDataSource.getRepository("job_requests");
    const jobRequest = await jobRequestRepository.findOne({
      where: { id: requestId },
    });


    if (user.role !== "owner") {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: "Only owner can update job request!" });
    }

    if (!jobRequest) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Job request not found" });
    }

    jobRequest.status = status;
    const updatedJobRequest = await jobRequestRepository.save(jobRequest);

    res.status(StatusCodes.OK).json(updatedJobRequest);
  } catch (error) {
    throw error;
  }
};

export const ownerController = {
  getStores,
  updateJobRequest,
};
