import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { Signup } from './signup';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

describe('Signup Component', () => {
  let component: Signup;
  let fixture: ComponentFixture<Signup>;
  let mockRouter: any;

  beforeEach(async () => {
    mockRouter = { navigate: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [Signup, FormsModule],
      providers: [
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Signup);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should select role correctly', () => {
    component.chooseRole('student');
    expect(component.selectedRole).toBe('student');
    expect(component.step).toBe(2);
  });

  it('should alert if required fields are empty', () => {
    vi.spyOn(window, 'alert').mockImplementation(() => {});
    component.submit();
    expect(window.alert).toHaveBeenCalledWith('Please fill all fields');
  });

  it('should alert if passwords do not match', () => {
    vi.spyOn(window, 'alert').mockImplementation(() => {});
    component.fullname = 'Test';
    component.email = 'test@test.com';
    component.username = 'testuser';
    component.password = '1234';
    component.confirmPassword = '4321';
    component.submit();
    expect(window.alert).toHaveBeenCalledWith('Passwords do not match');
  });

  it('should alert if email is already registered', () => {
    vi.spyOn(window, 'alert').mockImplementation(() => {});
    // Add existing user
    localStorage.setItem('users', JSON.stringify([{ email: 'test@test.com' }]));

    component.fullname = 'Test';
    component.email = 'test@test.com';
    component.username = 'testuser';
    component.password = '1234';
    component.confirmPassword = '1234';
    component.selectedRole = 'student';
    component.submit();

    expect(window.alert).toHaveBeenCalledWith('Email already registered');
  });

  it('should store new user and navigate to profile', () => {
    component.fullname = 'Test';
    component.email = 'new@test.com';
    component.username = 'newuser';
    component.password = '1234';
    component.confirmPassword = '1234';
    component.selectedRole = 'student';

    component.submit();

    const savedUser = JSON.parse(localStorage.getItem('currentUser')!);
    expect(savedUser.email).toBe('new@test.com');
    expect(localStorage.getItem('role')).toBe('student');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/profile']);
  });
});
