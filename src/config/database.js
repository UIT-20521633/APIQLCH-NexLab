import { DataSource } from "typeorm";
import { env } from "./environment";

const AppDataSource = new DataSource({
  type: "postgres",
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  synchronize: true, // Chỉ dùng trong dev mode
  entities: [__dirname + "/../entities/*"],
});

export default AppDataSource;
