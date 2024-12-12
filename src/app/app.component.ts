import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ToastModule} from "primeng/toast";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {ThemeService} from "@shared/services/theme.service";
import {ConfirmDialog} from "primeng/confirmdialog";
import {Button} from "primeng/button";


@Component({
    selector: 'app-root',
    imports: [RouterOutlet, ToastModule, TranslateModule, ConfirmDialog, Button],
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
