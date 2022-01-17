import { RouterMiddleware } from "https://deno.land/x/oak@v10.1.0/router.ts";
import { RouteFactory } from "./types.ts";

export function routeFactory<
  TFactoryOptions = unknown,
  TRoutePath extends string = string
>(
  path: TRoutePath,
  middlewareFactory: (options: TFactoryOptions) => RouterMiddleware<TRoutePath>
): RouteFactory<TRoutePath, TFactoryOptions> {
  return (options) => [path, middlewareFactory(options)];
}
