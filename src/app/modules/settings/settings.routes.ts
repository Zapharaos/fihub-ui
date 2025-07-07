import {Routes} from "@angular/router";
import {AccountComponent} from "@modules/settings/pages/account/account.component";
import {PasswordComponent} from "@modules/settings/pages/password/password.component";

export const routes: Routes = [
  {
    path: 'account',
    component: AccountComponent,
  },
  {
    path: 'security/password',
    component: PasswordComponent,
  },
];
