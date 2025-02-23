import { EntitySchema } from "typeorm";

export const JobRequestEntity = new EntitySchema({
  name: "job_requests",
  columns: {
    id: { primary: true, type: "uuid", generated: "uuid" },
    freelancerId: { type: "uuid" },
    storeId: { type: "uuid" },
    status: { type: "enum", enum: ["pending", "accepted", "rejected"] },
    createdAt: { type: "timestamp", default: () => "CURRENT_TIMESTAMP" },
    updatedAt: { type: "timestamp", default: null },
    _destroy: { type: "boolean", default: false },
  },
  relations: {
    store: {
      target: "stores",
      type: "many-to-one",
      joinColumn: { name: "storeId" },
    },
    freelancer: {
      target: "freelancers",
      type: "many-to-one",
      joinColumn: { name: "freelancerId" },
    },
  },
});
