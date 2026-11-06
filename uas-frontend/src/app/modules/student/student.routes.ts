import { Routes } from '@angular/router';

export const STUDENT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./student-dashboard/student-dashboard').then(m => m.StudentDashboard)
  },
  {
    path: 'fees',
    loadComponent: () =>
      import('./student-fees/student-fees').then(m => m.StudentFees)
  }
];
