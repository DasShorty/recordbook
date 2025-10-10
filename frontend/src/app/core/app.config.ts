import {ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {providePrimeNG} from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import {HTTP_INTERCEPTORS, provideHttpClient, withFetch} from '@angular/common/http';
import {OptionalResponseInterceptor} from '@shared/http/optional.response.interceptor';
import {definePreset} from '@primeuix/themes';

const MyPreset = definePreset(Aura, {
  semantic: {
    colorScheme: {

    }
  },
  components: {
    breadcrumb: {
      root: {
        background: '#f5f5f5'
      }
    }
  },
  css: options => {
    return `
            body {
                background-color: #f5f5f5;;
                color: black;
            }
        `;
  }
});


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(withFetch()),
    provideRouter(routes),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: OptionalResponseInterceptor,
      multi: true
    },
    provideAnimationsAsync(),
    providePrimeNG({
      ripple: true,
      theme: {
        preset: MyPreset,
        options: {
          darkModeSelector: '.dark-mode',
          cssLayer: false
        }
      }
    })
  ]
};
