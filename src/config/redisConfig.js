const { Redis } = require('ioredis');
require('dotenv').config();

const client = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT), // Convert to integer
});

client.on("error", (err) => console.error("Redis Client Error", err));
client.on("connect", () => console.log("Connected to Redis"));

module.exports = client;
