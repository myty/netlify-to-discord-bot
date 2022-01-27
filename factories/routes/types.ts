import { HandlerFunc } from "../../deps.ts";

export type RouteFactory<
  TRoutePath extends string,
  TRouteFactoryOptions = unknown,
> = (
  options: TRouteFactoryOptions,
) => [TRoutePath, HandlerFunc];
