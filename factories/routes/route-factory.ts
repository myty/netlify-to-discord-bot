import { HandlerFunc } from "../../deps.ts";
import { RouteFactory } from "./types.ts";

export function routeFactory<
  TFactoryOptions = unknown,
  TRoutePath extends string = string,
>(
  path: TRoutePath,
  middlewareFactory: (options: TFactoryOptions) => HandlerFunc,
): RouteFactory<TRoutePath, TFactoryOptions> {
  return (options) => [path, middlewareFactory(options)];
}
