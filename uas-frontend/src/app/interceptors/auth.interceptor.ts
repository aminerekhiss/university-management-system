import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastr = inject(ToastrService);
  const token = localStorage.getItem('token');

  let authReq = req;

  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // 401 Unauthorized
      if (error.status === 401) {
       // toastr.error('Session expired. Please login again.', 'Unauthorized');

        // Only clear and redirect if we are not already on login page to avoid loops
        if (!router.url.includes('/login')) {
          localStorage.clear();
          sessionStorage.clear();
          router.navigate(['/login']);
        }
      }
      // 403 Forbidden
      else if (error.status === 403) {
        toastr.warning('You do not have permission to perform this action.', 'Forbidden');
      }
      // 404 Not Found
      else if (error.status === 404) {
        // Optional: Don't show toast for every 404 if the app handles it locally
        // But for global safety:
        toastr.error('Requested resource not found.', 'Not Found');
      }
      // 422 Validation Error (Laravel defaults)
      else if (error.status === 422) {
        // Usually forms handle this, but we can show a summary
        const msg = error.error?.message || 'Validation Error';
        toastr.warning(msg, 'Validation');
      }
      // 500 Server Error
      else if (error.status === 500) {
        toastr.error('Internal Server Error. Please try again later.', 'Server Error');
      }
      // 0 Network Error
      else if (error.status === 0) {
        toastr.error('Cannot connect to server. Please check your internet connection.', 'Network Error');
      }
      // Other
      else {
        const msg = error.error?.message || 'An unexpected error occurred.';
        toastr.error(msg, 'Error');
      }

      return throwError(() => error);
    })
  );
};
