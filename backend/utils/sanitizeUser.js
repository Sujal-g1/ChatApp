export const sanitizeUser = (user) => {
  const safeUser = user.toObject ? user.toObject() : { ...user };

  delete safeUser.password;
  delete safeUser.encryptedPrivateKey;
  delete safeUser.encryptionIV;
  delete safeUser.encryptionAuthTag;
  delete safeUser.__v;

  return safeUser;
};