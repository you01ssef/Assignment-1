import {
  randomBytes,
  scrypt,
  timingSafeEqual,
  createCipheriv,
  createDecipheriv,
  createHash,
} from "node:crypto";
import { promisify } from "node:util";
const derive = promisify(scrypt);
export const token = () => randomBytes(32).toString("hex");
export const digest = (value) =>
  createHash("sha256").update(value).digest("hex");
export async function hashPassword(
  password,
  salt = randomBytes(16).toString("hex"),
) {
  const key = await derive(password, salt, 64, {
    N: 32768,
    r: 8,
    p: 1,
    maxmem: 64 * 1024 * 1024,
  });
  return `${salt}:${key.toString("hex")}`;
}
export async function verifyPassword(password, stored) {
  const [salt, expected] = stored.split(":");
  const actual = (await hashPassword(password, salt)).split(":")[1];
  return timingSafeEqual(
    Buffer.from(actual, "hex"),
    Buffer.from(expected, "hex"),
  );
}
export function encrypt(text, key, owner) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  cipher.setAAD(Buffer.from(String(owner)));
  const ciphertext = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);
  return [iv, cipher.getAuthTag(), ciphertext]
    .map((b) => b.toString("base64"))
    .join(".");
}
export function decrypt(value, key, owner) {
  const [iv, tag, ciphertext] = value
    .split(".")
    .map((v) => Buffer.from(v, "base64"));
  const cipher = createDecipheriv("aes-256-gcm", key, iv);
  cipher.setAAD(Buffer.from(String(owner)));
  cipher.setAuthTag(tag);
  return Buffer.concat([cipher.update(ciphertext), cipher.final()]).toString(
    "utf8",
  );
}
