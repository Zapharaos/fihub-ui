import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import {provideHttpClient, HttpClient, withInterceptors} from "@angular/common/http";
import {TranslateModule, TranslateLoader} from "@ngx-translate/core";
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { routes } from './app.routes';
import {MessageService} from "primeng/api";
import {ApiModule, Configuration} from "@core/api";
import {AuthService} from "@core/services/auth.service";
import {authInterceptor} from "@core/interceptors/auth.interceptor";

const httpLoaderFactory: (http: HttpClient) => TranslateHttpLoader = (http: HttpClient) =>
  new TranslateHttpLoader(http, './assets/i18n/', '.json');

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptor])),
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
    MessageService
  ]
};
