import { encryptMessage, decryptMessage, ENCRYPTION_VERSION, } from "./crypto";
import { requirePrivateKey } from "./keyHealth";

import axios from "axios";

const publicKeyCache = new Map();

export const getUserPublicKey = async (userId) => {
  if (publicKeyCache.has(userId)) {
    return publicKeyCache.get(userId);
  }

  const { data } = await axios.get(
    `/api/auth/public-key/${userId}`
  );

  if (!data.success) {
    throw new Error("Unable to fetch public key");
  }

  publicKeyCache.set(userId, data.publicKey);

  return data.publicKey;
};

export const encryptForUser = async (userId, text) => {

    let publicKey = publicKeyCache.get(userId);

    if (!publicKey) {

        const { data } =
            await axios.get(`/api/auth/public-key/${userId}`);

        if (!data.success) {
            throw new Error("Unable to fetch public key");
        }

        publicKey = data.publicKey;

        publicKeyCache.set(userId, publicKey);
    }

    const privateKey = await requirePrivateKey();

    const encrypted = encryptMessage(
    text,
    privateKey,
    publicKey
);

    return {
    ...encrypted,
    encryptionVersion: 1,
};
    
};

export const decryptIncomingMessage = async (message, myUserId) => {

    if (!message.cipherText) {
        return message;
    }
    // console.log("MESSAGE", message);

    const version = message.encryptionVersion || 1;

    const myPrivateKey = await requirePrivateKey();

    const otherPublicKey =
    String(message.senderId._id) === String(myUserId)
        ? message.receiverId.publicKey
        : message.senderId.publicKey;

    // console.log("senderPublicKey",
    // message.senderPublicKey,
    // message.senderId?.publicKey
    // )

    let text = null;

    switch (version) {

        case 1:

    text = decryptMessage(
    message.cipherText,
    message.nonce,
    otherPublicKey,
    myPrivateKey
);
        // console.log("nonce", message.nonce);

// console.log("cipher", message.cipherText);

// console.log("myPrivateKey", myPrivateKey);

// console.log("DECRYPTED", text);

            break;

        default:

            throw new Error(
                `Unsupported encryption version: ${version}`
            );
    }

    return {
        ...message,
        text,
    };
};


// cache will be cleared when user logs out or switches accounts
export const clearEncryptionCache = () => {
    publicKeyCache.clear();
};