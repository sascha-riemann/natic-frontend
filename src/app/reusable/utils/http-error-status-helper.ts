import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';

export interface NaticHttpErrorResponse {
  error: {
    message?: string;
  };
}

export class HttpErrorStatusHelper {
  public static UNAUTHORIZED(error: HttpErrorResponse): boolean {
    return error.status === HttpStatusCode.BadRequest;
  }

  public static CONFLICT(error: HttpErrorResponse): boolean {
    return error.status === HttpStatusCode.Conflict;
  }
}
