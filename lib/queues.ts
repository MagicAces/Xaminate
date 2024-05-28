import Queue from "bull";
import client from "./redis"; // Adjust the path according to your structure
import { checkSessionStatus } from "./sessions";

const redisOptions = {
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || "12345"),
    password: process.env.REDIS_PASSWORD,
  },
};

console.log(redisOptions);

export const statusQueue = new Queue("statuses", redisOptions);
