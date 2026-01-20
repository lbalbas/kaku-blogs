import { type PrismaConfig } from "prisma";

export default {
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL ?? "",
    directUrl: process.env.DIRECT_URL ?? "",
  },
} satisfies PrismaConfig;
