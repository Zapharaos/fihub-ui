import {Component, OnInit} from '@angular/core';
import {Button} from "primeng/button";
import {CardModule} from "primeng/card";
import {DividerModule} from "primeng/divider";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {PasswordModule} from "primeng/password";
import {PrimeTemplate} from "primeng/api";
import {RouterLink} from "@angular/router";
import {CheckboxModule} from "primeng/checkbox";

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
    PrimeTemplate,
    ReactiveFormsModule,
    RouterLink,
    CheckboxModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  ngOnInit() {
    this.registerForm = new FormGroup({
      firstname: new FormControl<object | null>(null),
      lastname: new FormControl<object | null>(null),
      email: new FormControl<object | null>(null),
      password: new FormControl<object | null>(null),
      confirmation: new FormControl<object | null>(null),
      agreement: new FormControl<object | null>(null),
    });
  }
}
