 import {
  generateKeyPair,
  encryptMessage,
  decryptMessage
} from "./crypto";

export const testEncryption = () => {

  const pairA = generateKeyPair();
  const pairB = generateKeyPair();

  console.log("PAIR A");
  console.log(pairA);

  console.log("PAIR B");
  console.log(pairB);

  const encrypted = encryptMessage(
    "hello",
    pairA.privateKey,
    pairB.publicKey
  );

  console.log("ENCRYPTED");
  console.log(encrypted);

  const decrypted = decryptMessage(
    encrypted.cipherText,
    encrypted.nonce,
    pairA.publicKey,
    pairB.privateKey
  );

  console.log("DECRYPTED");
  console.log(decrypted);
};