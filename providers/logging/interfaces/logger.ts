export interface Logger {
  error(...data: unknown[]): void;
  error(message: string, ...data: unknown[]): void;
  log(...data: unknown[]): void;
  log(message: string, ...data: unknown[]): void;
}
