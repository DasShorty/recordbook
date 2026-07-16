import {ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptors} from '@angular/common/http';
import {OptionalResponseInterceptor} from '@core/http/optional.response.interceptor';
import {validateAuthenticationInterceptor} from '@core/http/interceptor/auth.interceptor';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(withFetch(), withInterceptors([validateAuthenticationInterceptor])),
    provideRouter(routes),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: OptionalResponseInterceptor,
      multi: true
    },
    provideAnimationsAsync()
  ]
};
