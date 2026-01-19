import IORedis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redis = new IORedis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT) || 6379,
    maxRetriesPerRequest: null,
});

redis.on("connect", async () => {
    const info = await redis.info("server");
    const version = info
        .split("\n")
        .find(line => line.startsWith("redis_version"));

    console.log("Redis connected:", version);
    console.log("Redis port:", process.env.REDIS_PORT);
});

redis.on("error", (err) => {
    console.error("Redis error:", err);
});

export default redis;