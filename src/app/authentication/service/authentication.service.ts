import { Injectable } from '@angular/core';
import { addYears } from 'date-fns';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  authenticated$ = new BehaviorSubject(this.getJWT() !== null);

  storeJWT(jwt: string): void {
    const expires = addYears(new Date(), 1);
    document.cookie = `JWT=${escape(jwt)}; expires=${expires.toUTCString()}`;
    this.authenticated$.next(true);
  }

  getJWT(): string | undefined {
    return this.getCookie('JWT');
  }

  getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts!.pop()!.split(';').shift();
    } else {
      return undefined;
    }
  }

  deleteJWT(): void {
    localStorage.removeItem('JWT');
    this.authenticated$.next(false);
  }
}
