import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import {provideHttpClient, HttpClient, withInterceptors, withFetch} from "@angular/common/http";
import {TranslateModule, TranslateLoader} from "@ngx-translate/core";
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { routes } from './app.routes';
import {ConfirmationService, MessageService} from "primeng/api";
import {ApiModule, Configuration} from "@core/api";
import {AuthService} from "@core/services/auth.service";
import {authInterceptor} from "@core/interceptors/auth.interceptor";
import {providePrimeNG} from "primeng/config";
import {FihubDefault} from "../assets/presets/fihub-default";
import {NotificationService} from "@shared/services/notification.service";
import {DialogService} from "@shared/services/dialog.service";
import {ConfirmService} from "@shared/services/confirm.service";
import {FormService} from "@shared/services/form.service";

const httpLoaderFactory: (http: HttpClient) => TranslateHttpLoader = (http: HttpClient) =>
  new TranslateHttpLoader(http, './assets/i18n/', '.json');

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    providePrimeNG({
      ripple: true,
      theme: {
        preset: FihubDefault,
        options: {
          darkModeSelector: '.p-dark',
          cssLayer: {
            name: 'primeng',
            order: 'tailwind-base, primeng, tailwind-utilities'
          }
        }
      }
    }),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    importProvidersFrom([TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
    })]),
    importProvidersFrom(ApiModule),
    {
      provide: Configuration,
      useFactory: (authService: AuthService) => new Configuration({
        credentials: {
          'Bearer': authService.getToken.bind(authService),
        }
      }),
      deps: [AuthService],
      multi: false
    },
    MessageService,
    ConfirmationService,
    NotificationService,
    DialogService,
    ConfirmService,
    FormService
  ]
};
