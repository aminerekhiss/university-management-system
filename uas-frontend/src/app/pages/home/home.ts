import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {

  isLoggedIn = false;
  user: any = null;

  constructor(private router: Router, private toastr: ToastrService) {
    const session = localStorage.getItem('currentUser');

    if (session) {
      this.isLoggedIn = true;
      this.user = JSON.parse(session);
    }
  }
  goToCreate() {
    if(this.isLoggedIn) {
      this.toastr.info('You are already logged in!', 'Info');
    } else {
      this.router.navigate(['/signup']);
    }
  }
}

