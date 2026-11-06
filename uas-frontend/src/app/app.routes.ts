import { Routes } from '@angular/router';
import { roleGuard } from './guards/role.guard';
import { tokenGuard } from './guards/token.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home').then(m => m.Home) },
  { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.Login) },
  { path: 'signup', loadComponent: () => import('./pages/signup/signup').then(m => m.Signup) },

  {
    path: 'profile',
    canActivate: [tokenGuard, roleGuard],
    data: { roles: ['student', 'staff', 'admin'] },
    loadComponent: () => import('./pages/profile/profile').then(m => m.Profile)
  },

  {
    path: 'student',
    canActivate: [tokenGuard, roleGuard],
    data: { roles: ['student'] },
    loadChildren: () => import('./modules/student/student.routes').then(m => m.STUDENT_ROUTES)
  },

  {
    path: 'staff',
    canActivate: [tokenGuard, roleGuard],
    data: { roles: ['staff'] },
    loadChildren: () => import('./modules/staff/staff.routes').then(m => m.STAFF_ROUTES)
  },

  {
    path: 'admin',
    canActivate: [tokenGuard, roleGuard],
    data: { roles: ['admin'] },
    loadChildren: () => import('./modules/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },

  { path: '**', redirectTo: '' }
];
