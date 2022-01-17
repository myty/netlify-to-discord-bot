import { State } from "https://deno.land/x/oak@v10.1.0/application.ts";
import {
  RouteParams,
  RouterMiddleware,
} from "https://deno.land/x/oak@v10.1.0/router.ts";

export type RouteFactory<
  TRoutePath extends string,
  TRouteFactoryOptions = unknown
> = <
  P extends RouteParams<TRoutePath> = RouteParams<TRoutePath>,
  S extends State = Record<string, unknown>
>(
  options: TRouteFactoryOptions
) => [TRoutePath, RouterMiddleware<TRoutePath, P, S>];
