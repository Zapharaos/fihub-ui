import {Component, OnInit} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import {CardModule} from "primeng/card";
import {Button} from "primeng/button";
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CardModule,
    Button,
    InputTextModule,
    PasswordModule,
    DividerModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl<string | null>(null),
      password: new FormControl<string | null>(null)
    });
  }
}
