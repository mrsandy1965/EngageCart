import * as Sentry from '@sentry/node';

let isInitialized = false;

export const initBackendErrorTracking = () => {
  const dsn = process.env.SENTRY_DSN;

  if (!dsn || isInitialized) {
    return;
  }

  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE || 0)
  });

  isInitialized = true;
};

export const captureBackendError = (error, context = {}) => {
  if (!isInitialized) {
    return;
  }

  Sentry.captureException(error, {
    extra: context
  });
};
