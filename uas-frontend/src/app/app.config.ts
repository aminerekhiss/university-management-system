import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

import { routes } from './app.routes';
import { AuthInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(
      withInterceptors([AuthInterceptor])
      
    ),

    provideAnimations(),

    provideToastr({
      positionClass: 'toast-bottom-right',
      timeOut: 3000,
      closeButton: true,
      progressBar: true
    })
  ]
};
