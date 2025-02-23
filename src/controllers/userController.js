/* eslint-disable no-useless-catch */
import { StatusCodes } from "http-status-codes";
import ms from "ms";
import AppDataSource from "~/config/database";
import ApiError from "~/utils/ApiError";
import bcryptjs from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { BrevoProvider } from "~/providers/BrevoProvider";
import { JwtProvider } from "~/providers/JwtProvider";
import { env } from "~/config/environment";
import { pickUser } from "~/utils/formatters";

const createNew = async (req, res, next) => {
  try {
    const { firstName, lastName, phone, email, password, role, dob, gender } =
      req.body;

    const userRepository = AppDataSource.getRepository("users");

    // Kiểm tra xem email hoặc số điện thoại đã tồn tại chưa
    const existedUser = await userRepository.findOne({
      where: [{ email }, { phone }],
    });
    if (existedUser) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ message: "Email hoặc số điện thoại đã tồn tại!" });
    }
    // Tạo data mới để lưu vào DB
    const newUser = userRepository.create({
      email,
      firstName,
      lastName,
      phone,
      password: bcryptjs.hashSync(password, 10),
      role,
      dob,
      gender,
      verifyToken: uuidv4(),
      verified: false,
    });
    // Lưu vào database
    await userRepository.save(newUser);
    //Nếu role là freelancer thì cần thêm thông tin freelancer vào DB
    if (role === "freelancer") {
      const freelancerRepository = AppDataSource.getRepository("freelancers");
      const newFreelancer = freelancerRepository.create({
        userId: newUser.id,
      });
      await freelancerRepository.save(newFreelancer);
    }

    // Gửi email xác thực tài khoản
    try {
      const verifycationLink = `${"http://localhost:8017"}/account/verification?email=${
        newUser.email
      }&token=${newUser.verifyToken}`;
      const customSubject =
        "Store Management Tool: Please verify your email before using our service!";
      const htmlContent = `
          <h3>Dear ${newUser.firstName} ${newUser.lastName},</h3>
          <p>Here is your verification link:</p>
          <p><a href="${verifycationLink}">${verifycationLink}</a></p>
          <p>Thank you for choosing us!</p>
          <p>Best regards,</p>
          <p>Store Management Team</p>
      `;
      // Gọi tới provider để gửi email
      await BrevoProvider.sendEmail(newUser.email, customSubject, htmlContent);
    } catch (emailError) {
      console.error("Lỗi khi gửi email:", emailError);
    }

    // Trả về phản hồi cho client
    res.status(StatusCodes.CREATED).json({
      message: "User created successfully! ",
      user: pickUser(newUser),
    });
  } catch (error) {
    next(error); // Sử dụng middleware xử lý lỗi
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existUser = await AppDataSource.getRepository("users").findOne({
      where: { email },
    });
    //Các bước kiểm tra cần thiết
    if (!existUser)
      return res
        .status(StatusCodes.CONFLICT)
        .json({ message: "Email hoặc số điện thoại đã tồn tại!" });
    if (!existUser.verified)
      return res
        .status(StatusCodes.NOT_ACCEPTABLE)
        .json("Your account is not active! Please verify your email!");
    if (!bcryptjs.compareSync(password, existUser.password))
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json("Your Email or Password is incorrect!");
    //  Nếu mọi thứ ok thì bắt đầu tạo token cho user để trả về cho FE
    //Tạo thông tin để đính kèm trong JWT Token bao gồm: _id, email của user
    const userInfo = {
      _id: existUser.id,
      email: existUser.email,
    };
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_PRIVATE_KEY,
      env.ACCESS_TOKEN_LIFE
    );
    const refreshToken = await JwtProvider.generateToken(
      userInfo,
      env.REFRESH_TOKEN_PRIVATE_KEY,
      env.REFRESH_TOKEN_LIFE
    );

    /**
     * Xử lý trả về httpOnly cookie cho FE
     * Đối với cái maxAge - thời gian sống của cookie thì chúng ta sẽ để tối đa là 14 ngày, tùy dự án.
     * Lưu ý: thời gian sống của cookie khác với cái thời gian sống của token
     */
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: ms("14 days"),
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: ms("14 days"),
    });

    res.status(StatusCodes.OK).json({
      accessToken,
      refreshToken,
      ...pickUser(existUser),
    });
  } catch (error) {
    throw error;
  }
};
const verifyAccount = async (req, res, next) => {
  try {
    //Query tìm user theo email
    const existUser = await AppDataSource.getRepository("users").findOne({
      where: { email: req.body.email },
    });

    //Các bước kiểm tra cần thiết
    if (!existUser)
      return res.status(StatusCodes.NOT_FOUND).json("Account not found!");
    if (existUser.isActive)
      return res
        .status(StatusCodes.NOT_ACCEPTABLE)
        .json("Your account is already active!");
    if (existUser.verifyToken !== req.body.token)
      return res.status(StatusCodes.UNAUTHORIZED).json("Token is incorrect!");

    //Nếu tất cả các bước kiểm tra đều qua thì tiến hành update thông tin user để verify tài khoản
    const updateData = {
      verified: true,
      verifyToken: null,
    };
    //Thực hiện update thông tin user
    const updatedUser = await AppDataSource.getRepository("users").save({
      ...existUser,
      ...updateData,
    });
    res.status(StatusCodes.OK).json({
      message: "Your account has been verified successfully!",
      user: pickUser(updatedUser),
    });
  } catch (error) {
    next(error);
  }
};
export const userController = {
  createNew,
  login,
  verifyAccount,
};
