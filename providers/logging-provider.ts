export interface LoggingProviderInterface {
  error(...data: unknown[]): void;
  error(message: string, ...data: unknown[]): void;
  log(...data: unknown[]): void;
  log(message: string, ...data: unknown[]): void;
}

export const LoggingProvider = (prefix: string): LoggingProviderInterface => ({
  log: createLogger(prefix, console.log),
  error: createLogger(prefix, console.error, "Error"),
});

export const DefaultLogger = LoggingProvider("default");

function createLogger(
  prefix: string,
  logFunction: (...data: unknown[]) => void,
  defaultMessage?: string,
) {
  return (...data: unknown[]) => {
    if (data.length > 0 && typeof data[0] === "string") {
      logFunction(generateLogMessage(prefix, data[0]), ...data.slice(1));
      return;
    }

    logFunction(generateLogMessage(prefix, defaultMessage));
  };
}

function generateLogMessage(prefix: string, message?: string) {
  if (message == null || message.trim() === "") {
    return `[${prefix}]`;
  }

  return `[${prefix}] ${message}`;
}
