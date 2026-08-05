import { getPrivateKey } from "./keyStorage";

export const hasPrivateKey = async () => {
    const key = await getPrivateKey();
    return !!key;
};

export const requirePrivateKey = async () => {
    const key = await getPrivateKey();

    if (!key) {
        throw new Error("Private key missing");
    }

    return key;
};