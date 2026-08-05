export const savePrivateKey = (key) => {
  if (!key) return;
  localStorage.setItem("privateKey", key);
};

export const getPrivateKey = () => {
  return localStorage.getItem("privateKey");
};

export const removePrivateKey = () => {
  localStorage.removeItem("privateKey");
};