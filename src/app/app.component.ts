import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ToastModule} from "primeng/toast";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {ThemeService} from "@core/services/theme.service";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastModule, TranslateModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  constructor(
    private translateService: TranslateService,
    private themeService: ThemeService,
  ) {
    // Translations
    this.translateService.addLangs(['fr', 'en']);
    this.translateService.setDefaultLang('en');
    this.translateService.use(this.translateService.getBrowserLang() || "en");
  }

  ngOnInit(){
    this.themeService.init();
  };
}
