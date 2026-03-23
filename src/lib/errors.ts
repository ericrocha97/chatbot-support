export class AppError extends Error {
  readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
  }
}

export class RateLimitError extends AppError {
  readonly limit: number;
  readonly resetAt: number;

  constructor(limit: number, resetAt: number) {
    super("Limite de requisições excedido.", 429);
    this.limit = limit;
    this.resetAt = resetAt;
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Não autorizado.") {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Acesso negado.") {
    super(message, 403);
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(message = "Serviço temporariamente indisponível.") {
    super(message, 503);
  }
}

export class InternalServerError extends AppError {
  constructor(
    message = "Desculpe, encontrei uma instabilidade nos meus sistemas e não consegui processar sua mensagem. Por favor, tente novamente em alguns instantes."
  ) {
    super(message, 500);
  }
}
