import {Routes} from "@angular/router";
import {ResetComponent} from "@modules/auth/pages/reset/reset.component";
import {LoginComponent} from "@modules/auth/pages/login/login.component";
import {RegisterComponent} from "@modules/auth/pages/register/register.component";

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
    path: 'reset',
    component : ResetComponent,
  },
];
