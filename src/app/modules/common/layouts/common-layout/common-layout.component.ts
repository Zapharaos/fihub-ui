import { Component } from '@angular/core';
import {BasicLayoutComponent} from "@shared/components/basic-layout/basic-layout.component";

@Component({
  selector: 'app-common-layout',
  imports: [
    BasicLayoutComponent,
  ],
  templateUrl: './common-layout.component.html',
  styleUrl: './common-layout.component.scss'
})
export class CommonLayoutComponent {

}
