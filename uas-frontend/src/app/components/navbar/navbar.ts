import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import LogRocket from 'logrocket';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent implements OnInit {

  role: string = 'guest';
  theme: 'dark' | 'light' = 'dark';

  currentUser: any = null;
  profileImage: string | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadUser();
    this.loadTheme();

    // Make navbar reactive on every route change
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.loadUser();
      });
  }

  /** 🔥 Loads role + user + profile image */
  loadUser() {
    const savedUser = localStorage.getItem('currentUser');

    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
      this.role = this.currentUser.role || 'guest';
      this.profileImage = this.currentUser.profile_image|| null;
      return;
    }

    // If no user → fallback to saved role
    const savedRole = localStorage.getItem('role');
    this.role = savedRole ? savedRole : 'guest';

    this.currentUser = null;
    this.profileImage = null;
  }

  goHome() {
    this.router.navigate(['/']);
  }

  logout() {
    LogRocket.startNewSession();
    localStorage.removeItem('currentUser');
    localStorage.removeItem('role');

    this.role = 'guest';
    this.currentUser = null;
    this.profileImage = null;

    this.router.navigate(['/login']);
  }

  
  loadTheme() {
    const saved = localStorage.getItem('theme');
    this.theme = saved === 'light' ? 'light' : 'dark';
    document.documentElement.classList.toggle('light', this.theme === 'light');
  }


  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', this.theme);
    document.documentElement.classList.toggle('light', this.theme === 'light');
  }
  goToProfile() {
  this.router.navigate(['/profile']);
}

}
