import Bun from 'bun';

export const parseEnv = (key: string) => {
  const value = Bun.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};
