import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, Subject, tap } from 'rxjs';

import { AuthenticationEndpoints } from '../authentication.module';
import { SignIn } from '../dto/sign-in';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly authenticated$ = new Subject<boolean>();

  constructor(private readonly http: HttpClient) {}

  isAuthenticated$(): Observable<boolean> {
    return this.authenticated$;
  }

  requestAuthenticationStatus$(): Observable<boolean> {
    return this.http.get<void>(AuthenticationEndpoints.CHECK).pipe(
      map(() => true),
      catchError(() => of(false)),
      tap(authenticated => this.authenticated$.next(authenticated)),
    );
  }

  checkRolePermission(): Observable<boolean> {
    return this.http.get<boolean>(AuthenticationEndpoints.CHECK_PERMISSION);
  }

  signIn(dto: SignIn): Observable<void> {
    return this.http.post<void>(AuthenticationEndpoints.SIGN_IN, {
      username: dto.username,
      password: dto.password,
    });
  }

  signOut(): Observable<void> {
    return this.http.get<void>(AuthenticationEndpoints.SIGN_OUT);
  }
}
