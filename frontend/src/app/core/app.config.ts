import {ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {providePrimeNG} from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import {HTTP_INTERCEPTORS, provideHttpClient, withFetch} from '@angular/common/http';
import {OptionalResponseInterceptor} from '@core/http/optional.response.interceptor';
import {definePreset} from '@primeuix/themes';
import {ConfirmationService, MessageService} from 'primeng/api';
import {DialogService} from 'primeng/dynamicdialog';

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      // Override the primary color scale with a different built-in palette (e.g., 'purple')
      50: '{purple.50}',
      100: '{purple.100}',
      200: '{purple.200}',
      300: '{purple.300}',
      400: '{purple.400}',
      500: '{purple.500}',
      600: '{purple.600}',
      700: '{purple.700}',
      800: '{purple.800}',
      900: '{purple.900}',
      950: '{purple.950}',
    },
  },
  components: {
    breadcrumb: {
      root: {
        background: '#e5e5e5'
      }
    },
    menu: {
      css: options => {
        return `
          .p-menu-list {
            margin: 0.25rem;
          }
        `
      }
    }
  },
  css: options => {
    return `
            body {
                background-color: #e5e5e5;
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
    MessageService,
    DialogService,
    ConfirmationService,
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
