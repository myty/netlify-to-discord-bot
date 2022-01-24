import { LoggingProvider } from "../providers/logging-provider.ts";

type AnyType = any;

export abstract class Request<TResponse = void> {
  private static _requestTypeId: symbol;

  static get requestTypeId() {
    if (
      !Object.getOwnPropertyDescriptor(this, "_requestTypeId") ||
      this._requestTypeId == null
    ) {
      Object.defineProperty(this, "_requestTypeId", {
        value: Symbol(`AsyncRequest-${this.name}`),
      });
    }

    return this._requestTypeId;
  }

  type(): TResponse {
    throw new Error("Method not implemented.");
  }
}

type Response<TRequest> = TRequest extends Request<infer TResponse> ? TResponse
  : never;

type Handler<TRequest extends Request> = (
  request: TRequest,
) => Response<TRequest>;

type RequestConstructor<TRequest extends Request> =
  & (new (
    ...args: AnyType
  ) => AnyType)
  & {
    prototype: TRequest;
  }
  & {
    requestTypeId: symbol;
  };

export class Mediator {
  #requestHandlers: Record<
    symbol,
    Handler<Request<AnyType>>
  > = {};
  #logger = LoggingProvider(this.constructor.name);

  use<TRequest extends Request<TResponse>, TResponse>(
    { name, requestTypeId }: RequestConstructor<TRequest>,
    handler: Handler<TRequest>,
  ): void {
    try {
      if (requestTypeId in this.#requestHandlers) {
        throw new Error(`Handler for ${name} already exists`);
      }

      this.#requestHandlers = {
        ...this.#requestHandlers,
        [requestTypeId]: handler as Handler<Request<AnyType>>,
      };
    } catch (e) {
      this.#logger.error(e);
      throw e;
    }
  }

  send<TRequest extends Request>(
    request: TRequest,
  ): Response<TRequest> {
    const { constructor } = request;
    const { name, requestTypeId } = isRequestConstructor<TRequest>(constructor)
      ? constructor
      : { name: undefined, requestTypeId: undefined };

    if (requestTypeId == null || !(requestTypeId in this.#requestHandlers)) {
      throw new Error(`No handler found for request, ${name}`);
    }

    const handler = this.#requestHandlers[requestTypeId];

    return handler(request);
  }
}

function isRequestConstructor<TRequest extends Request>(
  constructor: AnyType,
): constructor is RequestConstructor<TRequest> {
  return constructor.requestTypeId != null &&
    typeof constructor.requestTypeId === "symbol";
}
