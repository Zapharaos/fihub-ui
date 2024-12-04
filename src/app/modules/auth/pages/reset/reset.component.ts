import {Component} from '@angular/core';
import {Button} from "primeng/button";
import {CardModule} from "primeng/card";
import {CheckboxModule} from "primeng/checkbox";
import {DividerModule} from "primeng/divider";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {PasswordModule} from "primeng/password";
import {Message, PrimeTemplate} from "primeng/api";
import {MessagesModule} from "primeng/messages";
import {TranslateModule, TranslatePipe, TranslateService} from "@ngx-translate/core";
import {Ripple} from "primeng/ripple";
import {UsersUserWithPassword} from "@core/api";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-reset',
  standalone: true,
  imports: [
    Button,
    CardModule,
    CheckboxModule,
    DividerModule,
    FormsModule,
    InputTextModule,
    PasswordModule,
    PrimeTemplate,
    ReactiveFormsModule,
    MessagesModule,
    TranslatePipe,
    Ripple,
    NgClass,
    TranslateModule
  ],
  templateUrl: './reset.component.html',
  styleUrl: './reset.component.scss'
})
export class ResetComponent {
  user: UsersUserWithPassword = {};
  confirmation: string = '';
  loading = false;
  error = false;
  messages: Message[] = [];

  constructor(
    private translateService: TranslateService
  ) {

  }

  reset() {

  }
}
