import dotenv from "dotenv";
dotenv.config();


import crypto from "crypto"
import { generateKeyPair } from "./crypto.js";

// 32-byte AES key from .env
const MASTER_KEY = Buffer.from(
  process.env.KEY_ENCRYPTION_SECRET,
  "base64"
);

if (MASTER_KEY.length !== 32) {
  throw new Error(
    "KEY_ENCRYPTION_SECRET must decode to exactly 32 bytes."
  );
}

/**
 * Encrypt a private key using AES-256-GCM
 */
export const encryptPrivateKey = (privateKey) => {
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(
    "aes-256-gcm",
    MASTER_KEY,
    iv
  );

  let encrypted = cipher.update(
    privateKey,
    "utf8",
    "base64"
  );

  encrypted += cipher.final("base64");

  const authTag = cipher.getAuthTag();

  return {
    encryptedPrivateKey: encrypted,
    encryptionIV: iv.toString("base64"),
    encryptionAuthTag: authTag.toString("base64"),
  };
};

/**
 * Decrypt an encrypted private key
 */
export const decryptPrivateKey = ({
  encryptedPrivateKey,
  encryptionIV,
  encryptionAuthTag,
}) => {
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    MASTER_KEY,
    Buffer.from(encryptionIV, "base64")
  );

  decipher.setAuthTag(
    Buffer.from(encryptionAuthTag, "base64")
  );

  let decrypted = decipher.update(
    encryptedPrivateKey,
    "base64",
    "utf8"
  );

  decrypted += decipher.final("utf8");

  return decrypted;
};

/**
 * Create a complete key package for a new user
 */
export const createUserKeys = () => {
  const { publicKey, privateKey } = generateKeyPair();

  const encrypted = encryptPrivateKey(privateKey);

  return {
    publicKey,
    privateKey,

    encryptedPrivateKey:
      encrypted.encryptedPrivateKey,

    encryptionIV:
      encrypted.encryptionIV,

    encryptionAuthTag:
      encrypted.encryptionAuthTag,

    keyVersion: 1,
  };
};

/**
 * Placeholder for future key rotation
 */
export const rotateKeys = () => {
  throw new Error(
    "Key rotation not implemented yet."
  );
};

/**
 * Validate encrypted key payload
 */
export const validateEncryptedKey = (keyData) => {
  return !!(
    keyData?.encryptedPrivateKey &&
    keyData?.encryptionIV &&
    keyData?.encryptionAuthTag
  );
};

export const getUserPrivateKey = (user) => {
  if (!validateEncryptedKey(user)) {
    throw new Error("Encrypted key data missing.");
  }

  return decryptPrivateKey({
    encryptedPrivateKey: user.encryptedPrivateKey,
    encryptionIV: user.encryptionIV,
    encryptionAuthTag: user.encryptionAuthTag,
  });
};