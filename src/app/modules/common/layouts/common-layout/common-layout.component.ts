import { Component } from '@angular/core';
import {BasicLayoutComponent} from "@shared/components/basic-layout/basic-layout.component";
import {Button} from "primeng/button";
import {RouterLink} from "@angular/router";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-common-layout',
  imports: [
    BasicLayoutComponent,
    Button,
    RouterLink,
    TranslatePipe,
  ],
  templateUrl: './common-layout.component.html',
  styleUrl: './common-layout.component.scss'
})
export class CommonLayoutComponent {

}
