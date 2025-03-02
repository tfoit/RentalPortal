require("dotenv").config({ path: ".env.development" });
const crypto = require("crypto");
const logger = require("../config/winstonConfig");

const encryptionKey = process.env.ENCRYPTION_KEY; // Ensure this is 32 bytes for AES-256
const iv = process.env.IV; // Ensure this is 16 bytes for AES-256

if (!encryptionKey || encryptionKey.length !== 64) {
  logger.error("Invalid ENCRYPTION_KEY length. It must be a 64-character hex string (32 bytes).");
  throw new Error("Invalid ENCRYPTION_KEY length. It must be a 64-character hex string (32 bytes).");
}

if (!iv || iv.length !== 32) {
  logger.error("Invalid IV length. It must be a 32-character hex string (16 bytes).");
  throw new Error("Invalid IV length. It must be a 32-character hex string (16 bytes).");
}

const encrypt = (text) => {
  if (!text) {
    return text; // Handle undefined or null values gracefully
  }
  try {
    let cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(encryptionKey, "hex"), Buffer.from(iv, "hex"));
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString("hex");
  } catch (error) {
    logger.error("Encryption error", { error: error.message });
    throw error;
  }
};

const decrypt = (text) => {
  if (!text) {
    return text; // Handle undefined or null values gracefully
  }
  try {
    let encryptedText = Buffer.from(text, "hex");
    let decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(encryptionKey, "hex"), Buffer.from(iv, "hex"));
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (error) {
    logger.error("Decryption error", { error: error.message });
    throw error;
  }
};

module.exports = { encrypt, decrypt };
