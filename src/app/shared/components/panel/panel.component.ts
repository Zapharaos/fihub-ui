import {Component, Input, TemplateRef} from '@angular/core';
import {Listbox} from "primeng/listbox";
import {TranslatePipe} from "@ngx-translate/core";
import {NgTemplateOutlet} from "@angular/common";

@Component({
  selector: 'app-panel',
  imports: [
    NgTemplateOutlet
  ],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.scss'
})
export class PanelComponent {
  @Input() icon!: string;
  @Input() contentTemplate!: TemplateRef<any>;
}
