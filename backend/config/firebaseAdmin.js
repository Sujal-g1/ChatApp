import admin from "firebase-admin";

const {
  FIREBASE_PROJECT_ID,
  FIREBASE_PRIVATE_KEY,
  FIREBASE_CLIENT_EMAIL,
} = process.env;

if (
  !FIREBASE_PROJECT_ID ||
  !FIREBASE_PRIVATE_KEY ||
  !FIREBASE_CLIENT_EMAIL
) {
  throw new Error("Firebase environment variables are missing.");
}

const serviceAccount = {
  type: "service_account",
  project_id: FIREBASE_PROJECT_ID,
  private_key: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email: FIREBASE_CLIENT_EMAIL,
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;