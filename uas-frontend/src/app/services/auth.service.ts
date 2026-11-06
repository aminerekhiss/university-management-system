import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  saveAuth(res: any) {
    localStorage.setItem('token', res.token);
    localStorage.setItem('currentUser', JSON.stringify(res.user));
    localStorage.setItem('role', res.user.role);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('role');
  }

  getUser() {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
  }

  getRole() {
    return localStorage.getItem('role');
  }

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }
}
