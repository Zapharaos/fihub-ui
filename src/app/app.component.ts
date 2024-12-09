import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ToastModule} from "primeng/toast";
import {TranslateModule, TranslateService} from "@ngx-translate/core";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastModule, TranslateModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(
    private translateService: TranslateService,
  ) {
    // Translations
    this.translateService.addLangs(['fr', 'en']);
    this.translateService.setDefaultLang('en');
    this.translateService.use(this.translateService.getBrowserLang() || "en");
  }
}
