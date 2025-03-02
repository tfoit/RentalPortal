const crypto = require("crypto");

// Generate a 32-byte (256-bit) encryption key for AES-256
const encryptionKey = crypto.randomBytes(32).toString("hex");

// Generate a 16-byte (128-bit) IV for AES-256
const iv = crypto.randomBytes(16).toString("hex");

console.log(`Encryption Key: ${encryptionKey}`);
console.log(`IV: ${iv}`);
