import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ToastModule} from "primeng/toast";
import {TranslateModule} from "@ngx-translate/core";
import {ThemeService} from "@shared/services/theme.service";
import {ConfirmDialog} from "primeng/confirmdialog";
import {Button} from "primeng/button";
import {ReactiveFormsModule} from "@angular/forms";
import {LanguageService} from "@shared/services/language.service";


@Component({
    selector: 'app-root',
    imports: [RouterOutlet, ToastModule, TranslateModule, ConfirmDialog, Button, ReactiveFormsModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  constructor(
    private themeService: ThemeService,
    private languageService: LanguageService
  ) { }

  ngOnInit(){
    this.themeService.init();
    this.languageService.init();
  };
}
