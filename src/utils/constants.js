/**
namnguyen
 */
import { env } from "~/config/environment";
export const WHITELIST_DOMAINS = [
  // "http://localhost:5173",// Không cần localhost nữa vì ở file config/cors đã luôn luôn cho phép môi trường dev (env.BUILD_MODE === 'dev')
  //Sau này sẽ thêm các domain khác vào đây
  // "https://ptollo-web-uit.vercel.app",
  "https://vermillion-malabi-3d2c1a.netlify.app",
  "http://localhost:4173",
];

export const WEBSITE_DOMAIN =
  env.BUILD_MODE === "production"
    ? env.WEBSITE_DOMAIN_PRODUCTION
    : env.WEBSITE_DOMAIN_DEVELOPMENT;
