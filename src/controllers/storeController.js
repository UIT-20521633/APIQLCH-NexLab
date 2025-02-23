import { StatusCodes } from "http-status-codes";
import AppDataSource from "~/config/database";

const createStore = async (req, res) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const { name, address, phone, email, logo } = req.body;
    //Kiểm tra xem user tạo cửa hàng là owner hay không
    const userRepository = AppDataSource.getRepository("users");
    const user = await userRepository.findOne({
      where: { id: req.jwtDecoded._id },
    });
    if (user.role !== "owner") {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: "Only owner can create store!" });
    }
    //Tạo cửa hàng mới
    const storeRepository = AppDataSource.getRepository("stores");
    const newStore = storeRepository.create({
      name,
      address,
      phone,
      email,
      logo,
      ownerId: req.jwtDecoded._id,
    });
    const savedStore = await storeRepository.save(newStore);

    res.status(StatusCodes.CREATED).json(savedStore);
  } catch (error) {
    throw error;
  }
};

export const storeController = {
  createStore,
};
