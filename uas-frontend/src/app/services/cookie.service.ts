import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CookieService {
  setCookie(name: string, value: string, days: number): void {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = 'expires=' + date.toUTCString();
    document.cookie = `${name}=${value};${expires};path=/`;
  }

  getCookie(name: string): string | null {
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    const prefix = name + '=';
    for (let c of ca) {
      c = c.trim();
      if (c.indexOf(prefix) === 0) {
        return c.substring(prefix.length, c.length);
      }
    }
    return null;
  }

  deleteCookie(name: string): void {
    // Set expiration in the past
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
  }
}
