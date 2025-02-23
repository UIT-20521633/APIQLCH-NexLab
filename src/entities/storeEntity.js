import { EntitySchema } from "typeorm";

export const StoreEntity = new EntitySchema({
  name: "stores",
  columns: {
    id: { primary: true, type: "uuid", generated: "uuid" },
    ownerId: { type: "uuid" },
    name: { type: "varchar", length: 255 },
    logo: { type: "text", nullable: true },
    phone: { type: "varchar" },
    email: { type: "varchar" },
    address: { type: "text" },
    createdAt: { type: "timestamp", default: () => "CURRENT_TIMESTAMP" },
    updatedAt: { type: "timestamp", default: null },
    _destroy: { type: "boolean", default: false },
  },
  relations: {
    owner: {
      target: "users",
      type: "many-to-one",
      joinColumn: { name: "ownerId" },
    },
  },
});
