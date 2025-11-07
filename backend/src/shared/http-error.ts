/**
 * Représente une erreur HTTP structurée.
 */
export class HttpError extends Error {
  public readonly status: number;
  public readonly code: string;

  /**
   * Construit une nouvelle erreur HTTP.
   * @param status Code HTTP associé.
   * @param code Identifiant d'erreur technique.
   * @param message Message destiné aux logs.
   */
  public constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

/**
 * Erreur représentant un accès refusé.
 */
export class UnauthorizedError extends HttpError {
  public constructor(message = "Unauthorized") {
    super(401, "unauthorized", message);
  }
}

/**
 * Erreur signalant une requête invalide.
 */
export class BadRequestError extends HttpError {
  public constructor(message = "Bad request") {
    super(400, "bad_request", message);
  }
}

/**
 * Erreur utilisée lorsque la fonctionnalité n'est pas encore disponible.
 */
export class NotImplementedError extends HttpError {
  public constructor(message = "Not implemented") {
    super(501, "not_implemented", message);
  }
}

