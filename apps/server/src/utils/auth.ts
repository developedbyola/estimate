import { env } from '@/configs/env';
import { type Context } from 'hono';
import * as Cookie from 'hono/cookie';
import { sign, verify } from 'hono/jwt';
import { UAParser } from 'ua-parser-js';
import { TRPCError } from '@trpc/server';
import { sha256 } from 'hono/utils/crypto';
import { getConnInfo as BunConnInfo } from 'hono/bun';
import type { JWTPayload } from 'hono/utils/jwt/types';

type TokenOptions = {
  type: 'access' | 'refresh';
  payload: {
    userId: string;
    sessionId: string;
  };
  expiresIn?: number;
};

const SECRETS = {
  access: env.ACCESS_TOKEN_SECRET,
  refresh: env.REFRESH_TOKEN_SECRET,
} as const;

const DEFAULT_EXPIRES = {
  access: 60 * 60,
  refresh: 60 * 60 * 24 * 90,
} as const;

/**
 * Gets the expiry time for a token.
 * @param {number} seconds - The number of seconds until the token expires.
 * @returns The expiry time in seconds.
 */
const getExpiry = (seconds: number) => Math.floor(Date.now() / 1000) + seconds;

/**
 * Creates a token for a user session.
 * @param {TokenOptions} options - The options for creating the token.
 * @param {string} options.type - The type of token to create ('access' or 'refresh').
 * @param {object} options.payload - The payload to include in the token.
 * @param {number} [options.expiresIn] - The number of seconds until the token expires.
 * @returns A promise that resolves to the created token.
 */

export async function createToken({ type, payload, expiresIn }: TokenOptions) {
  const exp = getExpiry(expiresIn ?? DEFAULT_EXPIRES[type]);
  const token = await sign({ ...payload, exp }, SECRETS[type]);
  return token;
}

/**
 * Decodes a token and returns the payload.
 * @param {string} type - The type of token to decode ('access' or 'refresh').
 * @param {string} token - The token to decode.
 * @return A promise that resolves to the decoded payload.
 */
export async function decodeToken(type: 'access' | 'refresh', token: string) {
  try {
    const decoded = await verify(token, SECRETS[type]);
    if (typeof decoded !== 'object' || decoded === null) {
      throw new Error();
    }
    return decoded as JWTPayload & TokenOptions['payload'];
  } catch {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Invalid token',
    });
  }
}

/**
 * Gets the IP address from the request, considering proxy headers.
 * Works in both development (Bun) and production (Render).
 */
const getIpAddress = (ctx: Context) => {
  if (env.NODE_ENV === 'development') {
    const conn = BunConnInfo(ctx);
    return conn?.remote?.address ?? 'unknown';
  }

  // Production (Render) - Use headers due to proxy
  return (
    ctx.req.header('x-forwarded-for')?.split(',')[0]?.trim() || // Most reliable on Render
    ctx.req.header('cf-connecting-ip') || // Cloudflare (if used)
    ctx.req.header('x-real-ip') || // Alternative header
    'unknown'
  );
};

export const auth = {
  getExpiry,
  expires: DEFAULT_EXPIRES,
  jwt: {
    sign: createToken,
    verify: decodeToken,
  },
  session: async (ctx: Context) => {
    const headers = ctx.req.raw.headers;

    const fingerprintPayload = [
      headers.get('user-agent'),
      headers.get('accept-language'),
      headers.get('sec-ch-ua-platform'),
    ].join('|');

    const fingerprint = await sha256(fingerprintPayload);

    const userAgent = headers.get('user-agent') || '';
    const appVersion = headers.get('x-app-version');

    const parser = new UAParser(userAgent);
    const ua = parser.getResult();

    const ipAddress = getIpAddress(ctx);

    return {
      userAgent,
      ipAddress,
      fingerprint,
      appVersion,
      osVersion: ua.os.version || 'unknown',
      deviceType: ua.device.type || 'unknown',
      deviceName: ua.device.type || 'unknown',
      expiresAt: Date.now() + DEFAULT_EXPIRES.refresh * 1000,
    };
  },

  cookie: (ctx: Context) => {
    return {
      set: (name: string, token: string) => {
        Cookie.setCookie(ctx, name, token, {
          path: '/',
          httpOnly: false,
          sameSite: 'lax',
          maxAge: DEFAULT_EXPIRES.refresh,
          secure: env.NODE_ENV === 'production',
        });
      },
      get: (name: string) => Cookie.getCookie(ctx, name),
      delete: (name: string) => Cookie.deleteCookie(ctx, name),
    };
  },
};
