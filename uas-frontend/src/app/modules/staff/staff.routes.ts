import { Routes } from '@angular/router';

export const STAFF_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./accountant-dashboard/accountant-dashboard')
        .then(m => m.AccountantDashboard)
  },

  {
    path: 'fees',
    loadComponent: () =>
      import('./accountant-fees/accountant-fees')
        .then(m => m.AccountantFees)
  },

  {
    path: 'payroll',
    loadComponent: () =>
      import('./staff-payroll/staff-payroll')
        .then(m => m.StaffPayroll)
  },

  {
    path: 'budget',
    loadComponent: () =>
      import('./department-budget/department-budget')
        .then(m => m.DepartmentBudget)
  },
];
