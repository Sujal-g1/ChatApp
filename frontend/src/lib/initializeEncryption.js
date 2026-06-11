import { generateKeyPair } from "./crypto";
import {
  getPrivateKey,
  savePrivateKey,
  savePublicKey,
  getPublicKey,
} from "./keyStorage";

let encryptionInitialized = false;

export const initializeEncryption = async (axios) => {

  if (encryptionInitialized) {
    console.log("Already initialized");
    return;
  }

  try {

    const existingKey = await getPrivateKey();

    console.log(
      "PRIVATE KEY FROM INDEXEDDB:",
      existingKey
    );

   const existingPrivateKey =
  await getPrivateKey();

if(existingPrivateKey){

  console.log(
    "Private key exists"
  );

  try{

    const storedPublicKey =
      await getPublicKey();

    const { data } =
      await axios.get(
        "/api/auth/check"
      );

    if(
      !data.user.publicKey &&
      storedPublicKey
    ){

      console.log(
        "Re-uploading missing public key..."
      );

      await axios.post(
        "/api/keys/public-key",
        {
          publicKey:
            storedPublicKey
        }
      );

      console.log(
        "Public key restored"
      );
    }

  }
  catch(error){

    console.log(
      "Public key recovery failed"
    );

    console.log(error);
  }

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