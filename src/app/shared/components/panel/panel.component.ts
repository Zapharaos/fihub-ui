import {Component, Input, TemplateRef} from '@angular/core';
import {NgIf, NgTemplateOutlet} from "@angular/common";

@Component({
  selector: 'app-panel',
  imports: [
    NgTemplateOutlet,
    NgIf
  ],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.scss'
})
export class PanelComponent {
  @Input() icon!: string;
  @Input() contentTemplate!: TemplateRef<any>;

  showPanel: boolean = false;

  onMouseEnter() {
    this.showPanel = true;
  }

  onMouseLeave() {
    this.showPanel = false;
  }
}
