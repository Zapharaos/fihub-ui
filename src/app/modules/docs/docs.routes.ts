import {Routes} from "@angular/router";
import {TermsComponent} from "@modules/docs/pages/terms/terms.component";
import {PrivacyComponent} from "@modules/docs/pages/privacy/privacy.component";

export const routes: Routes = [

  {
    path: 'terms',
    component: TermsComponent,
  },
  {
    path: 'privacy',
    component: PrivacyComponent,
  },
];
