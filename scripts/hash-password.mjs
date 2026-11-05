import { pbkdf2Sync, randomBytes } from "node:crypto";
if (!process.env.ADMIN_PASSWORD)
  throw Error("请通过 ADMIN_PASSWORD 环境变量提供密码，不要写入源码");
const salt = randomBytes(16).toString("hex");
console.log(
  `100000:${salt}:${pbkdf2Sync(process.env.ADMIN_PASSWORD, salt, 100000, 32, "sha256").toString("hex")}`,
);
