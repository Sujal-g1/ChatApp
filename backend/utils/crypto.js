import nacl from "tweetnacl";
import util from "tweetnacl-util";

export const generateKeyPair = () => {

  const keyPair =
    nacl.box.keyPair();

  return {
    publicKey:
      util.encodeBase64(
        keyPair.publicKey
      ),

    privateKey:
      util.encodeBase64(
        keyPair.secretKey
      )
  };
};