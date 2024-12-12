import {Component, Input, TemplateRef} from '@angular/core';
import {Button} from "primeng/button";
import {FormsModule} from "@angular/forms";
import {NgIf, NgTemplateOutlet} from "@angular/common";
import {TableModule} from "primeng/table";
import {TranslatePipe} from "@ngx-translate/core";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-dashboard-item-layout',
  standalone: true,
  imports: [
    FormsModule,
    TableModule,
    TranslatePipe,
    NgTemplateOutlet,
    NgIf,
    Button,
    RouterLink,
  ],
  templateUrl: './dashboard-item-layout.component.html',
  styleUrl: './dashboard-item-layout.component.scss'
})
export class DashboardItemLayoutComponent {
  @Input() title: string = "";
  @Input() backRoute: string = "";
  @Input() backTitle: string = "";
  @Input() actionsTemplate!: TemplateRef<any>;
  @Input() contentTemplate!: TemplateRef<any>;

  constructor() { }
}
