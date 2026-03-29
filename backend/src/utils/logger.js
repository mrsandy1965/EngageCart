const defaultLevel = process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug');

const writeLog = (level, message, meta = {}) => {
  const payload = {
    level,
    timestamp: new Date().toISOString(),
    message,
    ...meta
  };

  const serialized = JSON.stringify(payload);

  if (level === 'error') {
    console.error(serialized);
    return;
  }

  if (level === 'warn') {
    console.warn(serialized);
    return;
  }

  if (defaultLevel === 'debug' || level !== 'debug') {
    console.log(serialized);
  }
};

const logger = {
  info(meta, message) {
    writeLog('info', message, meta);
  },
  warn(meta, message) {
    writeLog('warn', message, meta);
  },
  error(meta, message) {
    writeLog('error', message, meta);
  },
  debug(meta, message) {
    writeLog('debug', message, meta);
  }
};

export const buildRequestLogMeta = (req, res) => ({
  method: req.method,
  path: req.originalUrl || req.url,
  statusCode: res.statusCode,
  userAgent: req.headers['user-agent'],
  ip: req.ip
});

export default logger;
