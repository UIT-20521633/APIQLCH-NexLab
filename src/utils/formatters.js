import { pick } from "lodash";

// Lấy một vài dữ liệu cụ thể trong User để tránh việc trả về các dữ liệu nhạy cảm như hash password
export const pickUser = (user) => {
  if (!user) return {};
  return pick(user, [
    "id",
    "firstName",
    "lastName",
    "email",
    "phone",
    "avatar",
    "role",
    "verified",
    "createdAt",
    "updatedAt",
  ]);
};
