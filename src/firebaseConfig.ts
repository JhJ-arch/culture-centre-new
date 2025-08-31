// Fix: Add a triple-slash directive to provide type definitions for `import.meta.env`.
/// <reference types="vite/client" />

// This configuration now securely loads credentials from Vercel's Environment Variables.
//
// IMPORTANT:
// 1. Go to your Firebase project settings to get your configuration values.
// 2. In your Vercel project settings, go to "Environment Variables".
// 3. Add a new variable for each item below (e.g., VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, etc.).
// 4. Paste the corresponding value from your Firebase config.
// 5. Redeploy your project for the changes to take effect.
//
// Note: Vite requires environment variables to be prefixed with 'VITE_' to be accessible in the frontend code.

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL, 
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Basic validation to help with debugging if environment variables are not set.
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error(
    "Firebase configuration is missing or incomplete. " +
    "Please ensure all VITE_FIREBASE_* environment variables are correctly set in your Vercel project settings."
  );
}

export default firebaseConfig;
