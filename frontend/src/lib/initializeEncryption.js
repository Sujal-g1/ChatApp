import { generateKeyPair } from "./crypto";
import {
  getPrivateKey,
  savePrivateKey,
  savePublicKey
} from "./keyStorage";

let encryptionInitialized = false;

export const initializeEncryption = async (axios) => {

  if (encryptionInitialized) {
    console.log("Already initialized");
    return;
  }

  try {

    const existingKey =
      await getPrivateKey();

    console.log(
      "PRIVATE KEY FROM INDEXEDDB:",
      existingKey
    );

    if (existingKey) {

      console.log(
        "Private key exists"
      );

      encryptionInitialized = true;

      return;
    }

    console.log(
      "Generating keypair..."
    );

    const keyPair =
      generateKeyPair();

    console.log(
      "GENERATED PUBLIC KEY:"
    );

    console.log(
      keyPair.publicKey
    );

    const response =
      await axios.post(
        "/api/keys/public-key",
        {
          publicKey:
            keyPair.publicKey
        }
      );

    console.log(
      "SAVE KEY RESPONSE:"
    );

    console.log(
      response.data
    );

    await savePrivateKey(
      keyPair.privateKey
    );

    await savePublicKey(
      keyPair.publicKey
    );

    encryptionInitialized = true;

  }
  catch(error){

    encryptionInitialized = false;

    console.log(
      "INITIALIZATION ERROR"
    );

    console.log(error);

  }
};