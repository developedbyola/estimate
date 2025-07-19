import { TRPCError, type TRPC_ERROR_CODE_KEY } from '@trpc/server';

type SuccessResponse<T extends object> = T & {
  meta?: {
    timestamp: string;
    [key: string]: unknown;
  };
};

type ErrorParams = {
  code: TRPC_ERROR_CODE_KEY;
  message: string;
  [key: string]: unknown;
};

export const response = {
  zod: {
    getFirstMessage: (error: Error): string | null => {
      try {
        const parsed = JSON.parse(error.message);
        return Array.isArray(parsed) && parsed[0]?.message
          ? parsed[0].message
          : null;
      } catch (e) {
        return null;
      }
    },
  },
  success: <T extends object>(
    data: T,
    meta?: Record<string, unknown>
  ): SuccessResponse<T> => {
    return {
      ...data,
      meta: {
        timestamp: new Date().toISOString(),
        ...meta,
      },
    };
  },
  error: (err: ErrorParams | TRPCError | Error | unknown): never => {
    console.log(err);
    if (err instanceof TRPCError) {
      throw err;
    }

    if (err instanceof Error) {
      throw new TRPCError({
        message: err.message,
        code: 'INTERNAL_SERVER_ERROR',
      });
    }

    throw new TRPCError({
      message: (err as any)?.message || 'An unexpected error occurred',
      code: (err as any)?.code || 'INTERNAL_SERVER_ERROR',
    });
  },
};
