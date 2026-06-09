const DB_NAME = "zingleee-e2ee";
const STORE_NAME = "keys";
const DB_VERSION = 1;

const openDB = () => {
  return new Promise((resolve, reject) => {

    const request = indexedDB.open(
      DB_NAME,
      DB_VERSION
    );

    request.onerror = () => {
      reject(request.error);
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = () => {

      const db = request.result;

      if (
        !db.objectStoreNames.contains(
          STORE_NAME
        )
      ) {
        db.createObjectStore(
          STORE_NAME
        );
      }
    };
  });
};

export const savePrivateKey = async (
  privateKey
) => {

  const db = await openDB();

  return new Promise((resolve,reject)=>{

    const tx =
      db.transaction(
        STORE_NAME,
        "readwrite"
      );

    const store =
      tx.objectStore(STORE_NAME);

    const request =
      store.put(
        privateKey,
        "privateKey"
      );

    request.onsuccess = () =>
      resolve(true);

    request.onerror = () =>
      reject(request.error);

  });
};

export const getPrivateKey =
async ()=>{

  const db = await openDB();

  return new Promise((resolve,reject)=>{

    const tx =
      db.transaction(
        STORE_NAME,
        "readonly"
      );

    const store =
      tx.objectStore(STORE_NAME);

    const request =
      store.get("privateKey");

    request.onsuccess = () =>
      resolve(request.result);

    request.onerror = () =>
      reject(request.error);

  });
};