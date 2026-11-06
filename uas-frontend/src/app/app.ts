import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar';
import { FooterComponent } from './components/footer/footer';
import { CookieService } from './services/cookie.service';
import { ToastComponent } from './components/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    RouterLink,
    NavbarComponent,
    FooterComponent,
    ToastComponent,
    
  
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {

  isLoggedIn = false;
  userRole: string | null = null;

  showCookieBanner = false;

  constructor(
    private router: Router,
    private cookieService: CookieService
  ) {
    this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.loadAuthStatus();
      }
    });
  }

  ngOnInit(): void {
    this.loadAuthStatus();
    this.checkCookieConsent();
  }

  loadAuthStatus() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('currentUser');

    this.isLoggedIn = !!token;

    if (user) {
      this.userRole = JSON.parse(user).role;
    } else {
      this.userRole = null;
    }
  }

  logout() {
    this.isLoggedIn = false;
    this.userRole = null;
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('role');

    this.router.navigate(['/login']);
  }

  checkCookieConsent() {
    const consent = this.cookieService.getCookie('cookieConsent');
    this.showCookieBanner = consent !== 'true';
  }

  acceptCookies() {
    this.cookieService.setCookie('cookieConsent', 'true', 365);
    this.showCookieBanner = false;
  }

  rejectCookies() {
    this.cookieService.setCookie('cookieConsent', 'false', 365);
    this.showCookieBanner = false;
  }
}
