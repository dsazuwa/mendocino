import { addColors, createLogger, format, transports } from 'winston';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  trace: 6,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'cyan',
  verbose: 'blue',
  debug: 'magenta',
  trace: 'white',
};

const isProduction = () => process.env.NODE_ENV === 'production';

const isTest = () => process.env.NODE_ENV === 'test';

const prodTransports = [
  new transports.File({
    filename: 'logs/prod/error.log',
    level: 'error',
  }),
];

const otherTransports = [
  new transports.File({
    filename: 'logs/dev/combined.log',
    silent: isTest(),
  }),

  new transports.Console({
    silent: isTest() && process.argv.indexOf('--silent') >= 0,

    format: format.combine(
      format.colorize(),
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.errors({ stack: true }),
      format.splat(),
      format.printf(
        ({ timestamp, level, message }) =>
          `${timestamp} [${level}]: ${message} `,
      ),
    ),
  }),
];

const logger = createLogger({
  levels,
  level: isProduction() ? 'error' : 'trace',
  transports: isProduction() ? prodTransports : otherTransports,
});

addColors(colors);

export default logger;
