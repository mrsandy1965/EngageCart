import * as Sentry from '@sentry/react';

const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
const tracesSampleRate = Number(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE || 0);

export const initFrontendErrorTracking = () => {
  if (!sentryDsn) {
    return;
  }

  Sentry.init({
    dsn: sentryDsn,
    environment: import.meta.env.MODE || 'development',
    tracesSampleRate
  });
};

export const captureFrontendError = (error, context = {}) => {
  if (!sentryDsn) {
    return;
  }

  Sentry.captureException(error, {
    extra: context
  });
};

export { Sentry };
