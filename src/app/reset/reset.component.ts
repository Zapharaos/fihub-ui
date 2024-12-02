import {Component, OnInit} from '@angular/core';
import {Button} from "primeng/button";
import {CardModule} from "primeng/card";
import {CheckboxModule} from "primeng/checkbox";
import {DividerModule} from "primeng/divider";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {PasswordModule} from "primeng/password";
import {PrimeTemplate} from "primeng/api";
import {RouterLink} from "@angular/router";

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
        RouterLink
    ],
  templateUrl: './reset.component.html',
  styleUrl: './reset.component.scss'
})
export class ResetComponent implements OnInit {
  resetForm!: FormGroup;

  ngOnInit() {
    this.resetForm = new FormGroup({
      password: new FormControl<object | null>(null),
      confirmation: new FormControl<object | null>(null),
    });
  }
}
