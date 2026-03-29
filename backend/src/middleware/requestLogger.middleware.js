import logger, { buildRequestLogMeta } from '../utils/logger.js';

const requestLogger = (req, res, next) => {
  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const elapsedNs = process.hrtime.bigint() - start;
    const durationMs = Number(elapsedNs) / 1_000_000;

    logger.info(
      {
        ...buildRequestLogMeta(req, res),
        durationMs: Number(durationMs.toFixed(2))
      },
      'HTTP request completed'
    );
  });

  next();
};

export default requestLogger;
