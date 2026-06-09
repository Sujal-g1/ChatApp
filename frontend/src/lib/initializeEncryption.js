import { generateKeyPair } from "./crypto";

import { getPrivateKey, savePrivateKey } from "./keyStorage";

export const initializeEncryption = async (axios)=>{

  try{

    const existingKey =
      await getPrivateKey();

    if(existingKey){

      console.log(
        "Private key exists"
      );

      return;
    }


    const keyPair =
      generateKeyPair();

    await axios.post(
      "/api/keys/public-key",
      {
        publicKey:
          keyPair.publicKey
      }
    );

    await savePrivateKey(
      keyPair.privateKey
    );


  }
  catch(error){

    console.log(error);

  }
}