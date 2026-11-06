import { CanActivateFn } from "@angular/router";

export const roleGuard: CanActivateFn = (route) => {
  const allowed = route.data?.['roles'];
  const user = JSON.parse(localStorage.getItem('currentUser') || 'null');

  if (!user) return false;

  return allowed.includes(user.role);
};
