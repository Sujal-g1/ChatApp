
import dotenv from "dotenv";
dotenv.config();

import {
  createUserKeys,
  decryptPrivateKey,
} from "./utils/keyManager.js";

console.log("\n========== KEY MANAGER TEST ==========\n");

//  const keys = createUserKeys();

console.log("✓ Public Key Generated");
console.log(keys.publicKey);

console.log("\n✓ Private Key Generated");
console.log(keys.privateKey);

console.log("\n✓ Encrypted Private Key");
console.log(keys.encryptedPrivateKey);

console.log("\n✓ IV");
console.log(keys.encryptionIV);

console.log("\n✓ Auth Tag");
console.log(keys.encryptionAuthTag);

const decrypted = decryptPrivateKey({
  encryptedPrivateKey: keys.encryptedPrivateKey,
  encryptionIV: keys.encryptionIV,
  encryptionAuthTag: keys.encryptionAuthTag,
});

console.log("\n========== RESULT ==========\n");

console.log(
  "Private Key Match:",
  decrypted === keys.privateKey
);

console.log(
  "Key Version:",
  keys.keyVersion
);