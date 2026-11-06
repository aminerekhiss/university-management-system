import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./admin-dashboard/admin-dashboard')
        .then(m => m.AdminDashboard)
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./manage-users/manage-users')
        .then(m => m.ManageUsers)
  }
];
