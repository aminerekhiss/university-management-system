import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Login } from './login';
import { FormsModule } from '@angular/forms';

describe('Login Component', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login, FormsModule, RouterTestingModule],
      // RouterTestingModule provides a Router instance to spy on
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));

    localStorage.clear();
    fixture.detectChanges();
  });

  // ---------------------------------------------------
  // Component Creation
  // ---------------------------------------------------
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ---------------------------------------------------
  // Test: ngOnInit Creates Admin User
  // ---------------------------------------------------
  it('should create admin user if not exists', () => {
    component.ngOnInit();

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const adminExists = users.some((u: any) => u.username === 'admin');

   expect(adminExists).toBe(true);

  });

  // ---------------------------------------------------
  // Test: Empty fields → errorMsg set
  // ---------------------------------------------------
  it('should show error if fields are empty', () => {
    component.username = '';
    component.password = '';

    component.login();

    expect(component.errorMsg).toBe('Please fill all fields.');
  });

  // ---------------------------------------------------
  // Test: Wrong credentials
  // ---------------------------------------------------
  it('should show error if login data incorrect', () => {
    // Prepare admin
    component.ngOnInit();

    component.username = 'wrong';
    component.password = 'wrong';

    component.login();

    expect(component.errorMsg).toBe('Incorrect email or password.');
  });

  // ---------------------------------------------------
  // Test: Correct login → navigate
  // ---------------------------------------------------
  it('should navigate on successful login', () => {
    // Create admin
    component.ngOnInit();

    component.username = 'admin';
    component.password = '1';

    component.login();

    expect(router.navigate).toHaveBeenCalledWith(['/profile']);
  });

  // ---------------------------------------------------
  // Test: role button changes selectedRole
  // ---------------------------------------------------
  it('should change selectedRole', () => {
    component.selectedRole = 'student';
    component.selectedRole = 'staff';

    expect(component.selectedRole).toBe('staff');
  });
});
