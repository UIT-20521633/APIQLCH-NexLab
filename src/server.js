/**
 * @namnguyen - Improved Server Setup
 */

import express from "express";
import cors from "cors";
import exitHook from "async-exit-hook";
import cookieParser from "cookie-parser";
import { corsOptions } from "~/config/cors";
import { env } from "~/config/environment";
import { APIs_V1 } from "~/routes/v1";
import { errorHandlingMiddleware } from "~/middlewares/errorHandlingMiddleware";
import AppDataSource from "./config/database";

const START_SERVER = async () => {
  try {
    // Kết nối database trước khi khởi động server
    await AppDataSource.initialize();
    console.log("✅ Database connected successfully!");

    const app = express();

    // Fix cache từ disk của ExpressJS
    app.use((req, res, next) => {
      res.set("Cache-Control", "no-store");
      next();
    });

    // Cấu hình sử dụng cookie-parser
    app.use(cookieParser());

    // Cấu hình CORS
    app.use(cors(corsOptions));

    // Kích hoạt JSON request body parsing
    app.use(express.json());

    // Sử dụng APIs_V1 cho tất cả các request bắt đầu bằng /v1
    app.use("/v1", APIs_V1);

    // Middleware xử lý lỗi tập trung
    app.use(errorHandlingMiddleware);

    // Chỉ chạy server khi database đã kết nối thành công
    const PORT = env.LOCAL_DEV_APP_PORT;
    const HOST = env.LOCAL_DEV_APP_HOST;

    app.listen(PORT, HOST, () => {
      console.log(
        `Local DEV: Hello ${env.AUTHOR}, Back-end server is running successfully at http://${HOST}:${PORT}/`
      );
    });

    // Xử lý sự kiện thoát chương trình
    exitHook(async (callback) => {
      console.log("Server is shutting down...");
      await AppDataSource.destroy();
      console.log("Database connection closed.");
      callback();
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1); // Dừng server nếu không kết nối được database
  }
};

// Khởi động server
START_SERVER();
