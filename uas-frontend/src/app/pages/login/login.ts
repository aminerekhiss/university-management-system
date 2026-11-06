import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CookieService } from '../../services/cookie.service';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import LogRocket from 'logrocket';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {

  form: FormGroup;
  selectedRole: 'student' | 'staff' | 'admin' = 'student';

  constructor(
    private router: Router,
    private cookieService: CookieService,
    private api: ApiService,
    private toastr: ToastrService,
    private auth: AuthService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      rememberMe: [false]
    });
  }

  login() {
  if (this.form.invalid) {
    this.toastr.warning('Please fill in all required fields correctly.', 'Invalid Form');
    this.form.markAllAsTouched();
    return;
  }

  const { email, password } = this.form.value;

  this.api.login(email, password).subscribe({
    next: (res: any) => {
      const userRole = res.user?.role;

      if (userRole !== this.selectedRole) {
        this.toastr.error(
          `This account is registered as ${userRole}, not ${this.selectedRole}.`,
          'Role Mismatch'
        );
        return;
      }

      // save auth
      this.auth.saveAuth(res);

      try{
      LogRocket.startNewSession();

      // ✅ identify user
      const user = res.user;
      LogRocket.identify(String(user?.id ?? user?._id ?? user?.email ?? 'unknown'), {
        role: user?.role,
        email: user?.email,
        name: user?.fullname
      }); }catch(e){console.warn('LogRocket identify failed', e);}

      this.toastr.success('Login successful!', 'Welcome Back');

      this.router.navigate(['/profile']);
    },
    error: (err) => {
      this.toastr.error(err.error?.message || 'Login failed', 'Error');
    }
  });
}



}
