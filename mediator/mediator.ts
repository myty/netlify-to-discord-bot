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
        value: Symbol(`Request-${this.name}`),
      });
    }

    return this._requestTypeId;
  }

  type(): TResponse {
    throw new Error("Method not implemented.");
  }
}

export abstract class Notification {
  private static _notificationTypeId: symbol;

  static get notificationTypeId() {
    if (
      !Object.getOwnPropertyDescriptor(this, "_notificationTypeId") ||
      this._notificationTypeId == null
    ) {
      Object.defineProperty(this, "_notificationTypeId", {
        value: Symbol(`Notification-${this.name}`),
      });
    }

    return this._notificationTypeId;
  }
}

type Response<TRequest> = TRequest extends Request<infer TResponse> ? TResponse
  : never;

type RequestHandler<TRequest extends Request> = (
  request: TRequest,
) => Response<TRequest>;

type NotificationHandler<TNotification extends Notification> = (
  notification: TNotification,
) => Promise<void>;

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

type NotificationConstructor<TNotification extends Notification> =
  & (new (
    ...args: AnyType
  ) => AnyType)
  & {
    prototype: TNotification;
  }
  & {
    notificationTypeId: symbol;
  };

export class Mediator {
  #logger = LoggingProvider(this.constructor.name);
  #notificationHandlers: Record<
    symbol,
    Array<NotificationHandler<Notification>>
  > = {};
  #requestHandlers: Record<
    symbol,
    RequestHandler<Request<AnyType>>
  > = {};

  notification<TNotification extends Notification>(
    { notificationTypeId }: NotificationConstructor<TNotification>,
    handler: NotificationHandler<TNotification>,
  ): void {
    try {
      this.#notificationHandlers = {
        ...this.#notificationHandlers,
        [notificationTypeId]: [
          ...(this.#notificationHandlers[notificationTypeId] ?? []),
          handler as NotificationHandler<Notification>,
        ],
      };
    } catch (e) {
      this.#logger.error(e);
      throw e;
    }
  }

  request<TRequest extends Request<TResponse>, TResponse>(
    { name, requestTypeId }: RequestConstructor<TRequest>,
    handler: RequestHandler<TRequest>,
  ): void {
    try {
      if (requestTypeId in this.#requestHandlers) {
        throw new Error(`Handler for ${name} already exists`);
      }

      this.#requestHandlers = {
        ...this.#requestHandlers,
        [requestTypeId]: handler as RequestHandler<Request<AnyType>>,
      };
    } catch (e) {
      this.#logger.error(e);
      throw e;
    }
  }

  async publish<TNotification extends Notification>(
    notificaiton: TNotification,
  ): Promise<void> {
    const { constructor } = notificaiton;
    const { name, notificationTypeId } =
      isNotificationConstructor<TNotification>(constructor)
        ? constructor
        : { name: undefined, notificationTypeId: undefined };

    if (
      notificationTypeId == null ||
      !(notificationTypeId in this.#notificationHandlers)
    ) {
      throw new Error(`No handler found for notification, ${name}`);
    }

    const handlers = this.#notificationHandlers[notificationTypeId];

    await Promise.all(handlers);
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

function isNotificationConstructor<TNotification extends Notification>(
  constructor: AnyType,
): constructor is NotificationConstructor<TNotification> {
  return constructor.notificationTypeId != null &&
    typeof constructor.notificationTypeId === "symbol";
}

function isRequestConstructor<TRequest extends Request>(
  constructor: AnyType,
): constructor is RequestConstructor<TRequest> {
  return constructor.requestTypeId != null &&
    typeof constructor.requestTypeId === "symbol";
}
