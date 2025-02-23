import { EntitySchema } from "typeorm";

export const UserEntity = new EntitySchema({
  name: "users",
  columns: {
    id: { primary: true, type: "uuid", generated: "uuid" },
    firstName: { type: "varchar", length: 255 },
    lastName: { type: "varchar", length: 255 },
    phone: { type: "varchar", unique: true },
    email: { type: "varchar", unique: true },
    password: { type: "varchar" },
    dob: { type: "date", nullable: true },
    gender: { type: "varchar", nullable: true },
    avatar: { type: "text", nullable: true },
    role: { type: "enum", enum: ["owner", "freelancer"] },
    verifyToken: { type: "varchar", nullable: true },
    verified: { type: "boolean", default: false },
    createdAt: { type: "timestamp", default: () => "CURRENT_TIMESTAMP" },
    updatedAt: { type: "timestamp", default: null },
    _destroy: { type: "boolean", default: false },
  },
});
