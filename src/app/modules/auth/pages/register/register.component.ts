import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {finalize} from "rxjs";
import {AuthFormComponent} from "@modules/auth/layouts/auth-form/auth-form.component";
import {FormUser} from "@shared/models/form-user";
import {UsersService} from "@core/api";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    AuthFormComponent
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  user: FormUser = {};
  loading = false;
  error = false;

  constructor(
    private router: Router,
    private usersService: UsersService,
  ) {

  }

  isSubmitDisabled(): boolean {
    return !this.user.email || !this.user.password || !this.user.confirmation || !this.user.checkbox
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
