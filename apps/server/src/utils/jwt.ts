import { env } from '@/configs/env';
import { TRPCError } from '@trpc/server';
import { sign, verify } from 'hono/jwt';

const SECRETS = {
  access: env.ACCESS_TOKEN_SECRET,
  refresh: env.REFRESH_TOKEN_SECRET,
} as const;

const EXPIRES_IN = {
  access: Math.floor(Date.now() / 1000) + 60 * 60,
  refresh: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 90,
} as const;

type TokenType = keyof typeof SECRETS;

const signToken = async (type: TokenType, payload: object) => {
  const token = await sign(
    { ...payload, exp: EXPIRES_IN[type] },
    SECRETS[type]
  );
  return token;
};

const verifyToken = async (type: TokenType, token: string) => {
  try {
    const decoded = await verify(token, SECRETS[type]);
    if (typeof decoded === 'string') {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Invalid token payload',
      });
    }
    return decoded;
  } catch (err) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Invalid token',
    });
  }
};

export const signAccessToken = (payload: object) =>
  signToken('access', payload);
export const signRefreshToken = (payload: object) =>
  signToken('refresh', payload);
export const verifyAccessToken = (token: string) =>
  verifyToken('access', token);
export const verifyRefreshToken = (token: string) =>
  verifyToken('refresh', token);
