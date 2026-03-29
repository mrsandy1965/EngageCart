import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  base: undefined,
  timestamp: pino.stdTimeFunctions.isoTime
});

export const buildRequestLogMeta = (req, res) => ({
  method: req.method,
  path: req.originalUrl || req.url,
  statusCode: res.statusCode,
  userAgent: req.headers['user-agent'],
  ip: req.ip
});

export default logger;
