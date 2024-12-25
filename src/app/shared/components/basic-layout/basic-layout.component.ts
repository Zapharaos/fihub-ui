import {Component, Input} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {ButtonModule} from "primeng/button";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {Ripple} from "primeng/ripple";
import {TranslateModule} from "@ngx-translate/core";
import {LayoutItem} from "@shared/models/layout-item";
import {ThemeService} from "@shared/services/theme.service";
import {FooterComponent} from "@shared/components/footer/footer.component";

@Component({
    selector: 'app-basic-layout',
    imports: [
        ButtonModule,
        NgIf,
        Ripple,
        RouterLink,
        RouterLinkActive,
        RouterOutlet,
        TranslateModule,
        NgClass,
        NgForOf,
        FooterComponent,
    ],
    templateUrl: './basic-layout.component.html',
    styleUrl: './basic-layout.component.scss'
})
export class BasicLayoutComponent {
  protected readonly logoPath = "assets/svg/logo-initial.svg";
  sidebarVisible: boolean = true;
  @Input() items: LayoutItem[] = [];
  @Input() sidebar: boolean = true;

  constructor(
    protected themeService: ThemeService,
  ) { }

  toggleSidebar() {
    if (!this.sidebar) {
      return;
    }
    this.sidebarVisible = !this.sidebarVisible;
  }

  toggleSubItems(item: LayoutItem) {
    if (!this.sidebar) {
      return;
    }
    item.subItemsInvisible = !item.subItemsInvisible;
  }
}
