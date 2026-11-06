import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';

interface ProfileState {
  loading: boolean;
  user: any | null;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class Profile {

  /* =========================
     STATE (LOCAL STORAGE)
  ========================= */
  private stateSubject = new BehaviorSubject<ProfileState>({
    loading: true,
    user: null
  });

  state$ = this.stateSubject.asObservable();

  editing = false;
  changingPassword = false;

  passwordForm = {
    current: '',
    new: '',
    confirm: ''
  };

  constructor(
    private api: ApiService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.loadFromLocalStorage();
  }

  /* =========================
     LOAD USER (FAST)
  ========================= */
  loadFromLocalStorage() {
    const cached = localStorage.getItem('currentUser');

    if (!cached) {
      this.router.navigate(['/login']);
      return;
    }

    const user = JSON.parse(cached);

    this.stateSubject.next({
      loading: false,
      user
    });
  }

  /* =========================
     IMAGE (LOCAL ONLY)
  ========================= */
  uploadImage(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files[0]) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const base64 = reader.result as string;

      const current = this.stateSubject.value.user;
      const updated = {
        ...current,
        profile_image: base64
      };

      localStorage.setItem('currentUser', JSON.stringify(updated));

      this.stateSubject.next({
        loading: false,
        user: updated
      });

      this.toastr.success('Profile photo updated');
    };

    reader.readAsDataURL(file);
  }

  /* =========================
     PASSWORD (API)
  ========================= */
  savePassword() {
    if (!this.passwordForm.current || !this.passwordForm.new || !this.passwordForm.confirm) {
      this.toastr.error('All fields are required');
      return;
    }

    if (this.passwordForm.new !== this.passwordForm.confirm) {
      this.toastr.error('Passwords do not match');
      return;
    }

    this.api.changePassword({
      current_password: this.passwordForm.current,
      new_password: this.passwordForm.new,
      new_password_confirmation: this.passwordForm.confirm
    }).subscribe({
      next: () => {
        this.toastr.success('Password updated successfully');
        this.passwordForm = { current: '', new: '', confirm: '' };
        this.changingPassword = false;
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Failed to update password');
      }
    });
  }

  /* =========================
     LOGOUT (API)
  ========================= */
  logout() {
    this.api.logout().subscribe({
      complete: () => {
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigate(['/login']);
      }
    });
  }
}
