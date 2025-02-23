/**
 * namnguyen
 */
import "dotenv/config";

export const env = {
  // Database Config
  DB_HOST: process.env.DB_HOST,
  DB_PORT: parseInt(process.env.DB_PORT),
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,

  LOCAL_DEV_APP_HOST: process.env.LOCAL_DEV_APP_HOST,
  LOCAL_DEV_APP_PORT: process.env.LOCAL_DEV_APP_PORT,

  BUILD_MODE: process.env.BUILD_MODE || "dev",

  AUTHOR: process.env.AUTHOR || "Nam Nguyen",

  WEBSITE_DOMAIN_DEVELOPMENT: process.env.WEBSITE_DOMAIN_DEVELOPMENT,
  WEBSITE_DOMAIN_PRODUCTION: process.env.WEBSITE_DOMAIN_PRODUCTION,

  BREVO_API_KEY: process.env.BREVO_API_KEY || "",
  ADMIN_EMAIL_ADDRESS: process.env.ADMIN_EMAIL_ADDRESS || "",
  ADMIN_EMAIL_NAME: process.env.ADMIN_EMAIL_NAME || "",

  ACCESS_TOKEN_PRIVATE_KEY: process.env.ACCESS_TOKEN_PRIVATE_KEY,
  ACCESS_TOKEN_LIFE: process.env.ACCESS_TOKEN_LIFE,

  REFRESH_TOKEN_PRIVATE_KEY: process.env.REFRESH_TOKEN_PRIVATE_KEY,
  REFRESH_TOKEN_LIFE: process.env.REFRESH_TOKEN_LIFE,
};
