import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class Signup {

  form!: FormGroup;
  step = 1;
  selectedRole: 'student' | 'staff' | null = null;
  departments: any[] = [];
  profileImage: string | null = null;

  constructor(
    private router: Router,
    private api: ApiService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadDepartments();
  }

  initForm() {
    this.form = this.fb.group({
      fullname: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],

      // Role specific (initially optional)
      universityId: [''],
      staffId: [''],
      program: [''],
      level: [''],
      departmentId: ['']
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl) {
    return control.get('password')?.value === control.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  loadDepartments() {
    this.api.adminGetDepartments().subscribe({
      next: (res: any) => {
        this.departments = res.data;
      },
      error: (err) => {
        console.error("Failed loading departments", err);
      }
    });
  }

  chooseRole(role: 'student' | 'staff') {
    this.selectedRole = role;
    this.step = 2;
    this.updateValidators();
  }

  updateValidators() {
    const programControl = this.form.get('program');
    

    if (this.selectedRole === 'student') {
      programControl?.setValidators([Validators.required]);
      
    } else {
      
      programControl?.clearValidators();
    }
    programControl?.updateValueAndValidity();
    
  }

 uploadImage(event: any) {
  const file = event.target.files[0];
  if (!file) return;

  // 🚫 Reject very large files (hard limit)
  if (file.size > 1024 * 1024) { // 1MB
    this.toastr.error('Image must be less than 1MB');
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    const base64 = reader.result as string;

    // 🚫 Extra safety: limit base64 length
    if (base64.length > 1_000_000) {
      this.toastr.error('Image is too large');
      return;
    }

    this.profileImage = base64;
  };

  reader.readAsDataURL(file);
}


  submit() {
  if (this.form.invalid) {
    this.toastr.warning(
      'Please fill all required fields correctly',
      'Validation Error'
    );
    this.form.markAllAsTouched();
    return;
  }

  const val = this.form.value;

  if (this.selectedRole === 'staff') {
    val.departmentId = 2; // Finance
  }

  const payload = {
    fullname: val.fullname,
    username: val.username,
    email: val.email,
    password: val.password,
    role: this.selectedRole,

    university_id: val.universityId || null,
    program: val.program || null,
    level: val.level || null,

    staff_id: val.staffId || null,
    department_id: val.departmentId || null,

    profile_image: this.profileImage || null
  };

  this.api.register(payload).subscribe({
    next: (res: any) => {
      const user = {
        ...res.user,
        profile_image: this.profileImage || null // 🔥 force keep image
      };

      localStorage.setItem('token', res.token);
      localStorage.setItem('currentUser', JSON.stringify(user));

      this.toastr.success('Account created successfully!', 'Welcome');
      this.router.navigate(['/profile']);
    },

    error: (err) => {
      if (err.status === 422) {
        const errors = err.error.errors;
        const firstError = errors
          ? Object.values(errors)[0]
          : 'Validation failed';

        const msg = Array.isArray(firstError)
          ? firstError[0]
          : firstError;

        this.toastr.error(msg as string, 'Validation Error');
      } else {
        this.toastr.error(
          err.error?.message || 'Registration failed.',
          'Error'
        );
      }
    }
  });
}

}
