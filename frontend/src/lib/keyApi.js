// Public Key Fetch Function

// export const getUserPublicKey = async (
//   axios,
//   userId
// ) => {

//   const { data } = await axios.get(
//     `/api/keys/${userId}`
//   );

//   if (!data.success) {
//     throw new Error(
//       "Failed to fetch public key"
//     );
//   }

//   return data.publicKey;
// };

export const getUserPublicKey = async (
  axios,
  userId
) => {

  console.log("REQUESTING KEY FOR:");
  console.log(userId);

  const { data } = await axios.get(
    `/api/keys/${userId}`
  );

  console.log("API RETURNED:");
  console.log(data);

  if (!data.success) {
    throw new Error(
      "Failed to fetch public key"
    );
  }

  return data.publicKey;
};