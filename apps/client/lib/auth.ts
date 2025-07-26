import { createAuthClient } from 'better-auth/react';
import { expoClient } from '@better-auth/expo/client';
import * as SecureStore from 'expo-secure-store';

export const auth = createAuthClient({
  baseURL: 'https://estimate-server.onrender.com', // Base URL of your Better Auth backend.
  plugins: [
    expoClient({
      scheme: 'estimate',
      storagePrefix: 'estimate',
      storage: SecureStore,
    }),
  ],
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  refreshToken,
  resetPassword,
  forgetPassword,
} = auth;

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
