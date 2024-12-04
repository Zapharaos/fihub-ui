import {Component} from '@angular/core';
import {Button} from "primeng/button";
import {CardModule} from "primeng/card";
import {DividerModule} from "primeng/divider";
import {FormBuilder, FormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {PasswordModule} from "primeng/password";
import {Message} from "primeng/api";
import {Router, RouterLink} from "@angular/router";
import {CheckboxModule} from "primeng/checkbox";
import {MessagesModule} from "primeng/messages";
import {Ripple} from "primeng/ripple";
import {NgClass} from "@angular/common";
import {UsersService, UsersUserWithPassword} from "@core/api";
import {finalize} from "rxjs";
import {TranslateModule, TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    Button,
    CardModule,
    DividerModule,
    FormsModule,
    InputTextModule,
    PasswordModule,
    RouterLink,
    CheckboxModule,
    MessagesModule,
    Ripple,
    NgClass,
    TranslateModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  user: UsersUserWithPassword = {};
  confirmation: string = '';
  agreement = false;
  loading = false;
  error = false;
  messages: Message[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private usersService: UsersService,
    private translateService: TranslateService
  ) {

  }

  register() {
    this.loading = true;

    this.usersService.createUser(this.user).pipe(finalize(() => {
      this.loading = false;
    })).subscribe({
      next: () => {
        this.router.navigate(['/dashboard'])
      },
      error: (error: any) => {
        console.log(error)
        this.loading = false;
      },
    })
  }
}
