import { encryptMessage, decryptMessage } from "./crypto";

import { getPrivateKey } from "./keyStorage";

export const encryptForUser = async ( plainText, receiverPublicKey ) => {

  const myPrivateKey =
    await getPrivateKey();

  const encrypted =
    encryptMessage(
      plainText,
      myPrivateKey,
      receiverPublicKey
    );

  return encrypted;
};

export const decryptFromUser = async ( cipherText, nonce, senderPublicKey ) => {

  const myPrivateKey =
    await getPrivateKey();

  return decryptMessage(
    cipherText,
    nonce,
    senderPublicKey,
    myPrivateKey
  );
};