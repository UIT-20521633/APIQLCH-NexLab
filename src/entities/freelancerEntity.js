import { EntitySchema } from "typeorm";

export const FreelancerEntity = new EntitySchema({
  name: "freelancers",
  columns: {
    id: { primary: true, type: "uuid", generated: "uuid" },
    userId: { type: "uuid" },
    //address{street, ward, district, city}
    address: { type: "text", nullable: true },
    isAvailable: { type: "boolean", default: true },
    createdAt: { type: "timestamp", default: () => "CURRENT_TIMESTAMP" },
    updatedAt: { type: "timestamp", default: null },
    _destroy: { type: "boolean", default: false },
  },
  relations: {
    user: {
      target: "users",
      type: "one-to-one",
      joinColumn: { name: "userId" },
    },
  },
});
