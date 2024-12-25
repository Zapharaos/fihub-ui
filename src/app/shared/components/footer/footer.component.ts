import { Component } from '@angular/core';
import {Button} from "primeng/button";
import {NgIf} from "@angular/common";
import {TranslatePipe} from "@ngx-translate/core";
import {RouterLink} from "@angular/router";

@Component({
    selector: 'app-footer',
  imports: [
    Button,
    NgIf,
    TranslatePipe,
    RouterLink
  ],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss'
})
export class FooterComponent {
  protected readonly logoPath = "assets/svg/logo-initial.svg";
}
