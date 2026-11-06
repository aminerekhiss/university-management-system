import { CanActivateFn } from '@angular/router';
export const tokenGuard: CanActivateFn = () => {
  return !!localStorage.getItem('token');
};
