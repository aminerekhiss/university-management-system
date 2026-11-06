import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { Profile } from './profile';
import { Router } from '@angular/router';

describe('Profile', () => {
  let component: Profile;
  let fixture: ComponentFixture<Profile>;
  let mockRouter = { navigate: vi.fn() };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Profile],
      providers: [
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Profile);
    component = fixture.componentInstance;
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load user from localStorage on init', () => {
    const testUser = { fullname: 'Test', username: 'test', email: 'test@test.com', password: '123', role: 'student' };
    localStorage.setItem('currentUser', JSON.stringify(testUser));

    component.ngOnInit();

    expect(component.user).toEqual(testUser);
    expect(component.editedUser).toEqual(testUser);
  });

  it('should redirect to /login if no user in localStorage', () => {
    component.ngOnInit();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should logout and remove localStorage items', () => {
    localStorage.setItem('currentUser', JSON.stringify({ username: 'test' }));
    localStorage.setItem('role', 'student');

    component.logout();

    expect(localStorage.getItem('currentUser')).toBeNull();
    expect(localStorage.getItem('role')).toBeNull();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should toggle editing and cancel edits', () => {
    const testUser = { fullname: 'Test', username: 'test' };
    component.user = testUser;
    component.editedUser = { ...testUser };

    component.toggleEdit();
    expect(component.editing).toBeTruthy();

    component.cancelEdit();
    expect(component.editing).toBeFalsy();
    expect(component.editedUser).toEqual(testUser);
  });

  // Optional: test savePassword & saveChanges by mocking alerts if needed
});
