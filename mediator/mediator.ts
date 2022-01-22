import {
  LoggingProvider,
  LoggingProviderInterface,
} from "../providers/logging-provider.ts";

interface IRequest<TReturn> {
  type(): TReturn;
}

export function Request<TResponse>(): new () => IRequest<TResponse> {
  class RequestClass<TResponse> implements IRequest<TResponse> {
    type(): TResponse {
      throw new Error("Method not implemented.");
    }
  }

  return RequestClass;
}

type ResponseOf<TRequest> = TRequest extends IRequest<infer TResponse>
  ? TResponse
  : never;

type HandlerOf<TRequest> = (
  request: TRequest,
) => Promise<ResponseOf<TRequest>>;

type ConstructorOf<TRequest> = { new (...args: any[]): TRequest };

class RequestHandlerStore {
  #requestHandlers: Record<string, (...args: any[]) => Promise<any>> = {};

  #logger: LoggingProviderInterface;

  constructor() {
    this.#logger = LoggingProvider(this.constructor.name);
  }

  add<TResponse>(
    name: string,
    handler: HandlerOf<TResponse>,
  ): void {
    try {
      if (name in this.#requestHandlers) {
        throw new Error(`Handler for ${name} already exists`);
      }

      this.#requestHandlers[name] = handler;
    } catch (e) {
      this.#logger.error(e);
      throw e;
    }
  }

  get<TRequest>(
    name: string,
  ): HandlerOf<TRequest> {
    if (name in this.#requestHandlers) {
      return this.#requestHandlers[name];
    }

    throw new Error(`No handler found for request, ${name}`);
  }
}

export class Mediator {
  #requestHandlerStore: RequestHandlerStore = new RequestHandlerStore();

  #logger: LoggingProviderInterface;

  constructor() {
    this.#logger = LoggingProvider(this.constructor.name);
  }

  use<TRequest>(
    requestObj: ConstructorOf<TRequest>,
    handler: HandlerOf<TRequest>,
  ): void {
    try {
      this.#requestHandlerStore.add(requestObj.name, handler);
    } catch (e) {
      this.#logger.error(e);
      throw e;
    }
  }

  send<TReturn>(
    request: IRequest<TReturn>,
  ): Promise<TReturn> {
    const { name } = request.constructor;

    const handler = this.#requestHandlerStore.get<typeof request>(name);
    if (handler == null) {
      throw new Error(`No handler found for request, ${name}`);
    }

    return handler(request);
  }
}

/**
 * Example usage
 *

    class Ping extends Request<string>() {
      constructor(public message: string) {
        super();
      }
    }

    const mediator = new Mediator();
    mediator.use(Ping, (request) => {
    return Promise.resolve(request.message);
    });

    const response = await mediator.send(new Ping("Hello"));

 */
