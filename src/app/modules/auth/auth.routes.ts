import {Routes} from "@angular/router";
import {LoginComponent} from "@modules/auth/pages/login/login.component";
import {RegisterComponent} from "@modules/auth/pages/register/register.component";
import {PasswordComponent} from "@modules/auth/pages/password/password.component";

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'password',
    component: PasswordComponent,
  },
];
