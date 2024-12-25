import {Component, Input, TemplateRef} from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {ButtonModule} from "primeng/button";
import {NgClass, NgForOf, NgIf, NgTemplateOutlet} from "@angular/common";
import {Ripple} from "primeng/ripple";
import {TranslateModule} from "@ngx-translate/core";
import {LayoutItem} from "@shared/models/layout-item";
import {FooterComponent} from "@shared/components/footer/footer.component";
import {ThemeService} from "@shared/services/theme.service";

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
    NgTemplateOutlet,
  ],
    templateUrl: './basic-layout.component.html',
    styleUrl: './basic-layout.component.scss'
})
export class BasicLayoutComponent {

  protected readonly logoPath = "assets/svg/logo-initial.svg";
  sidebarVisible: boolean = true;
  @Input() homePath: string = '/';
  @Input() items: LayoutItem[] | undefined;
  @Input() actionsTemplate!: TemplateRef<any>;

  constructor(
    private router: Router,
    protected themeService: ThemeService
  ) { }

  home() {
    this.router.navigate([this.homePath]);
  }

  toggleSidebar() {
    if (this.items) {
      return;
    }
    this.sidebarVisible = !this.sidebarVisible;
  }

  toggleSubItems(item: LayoutItem) {
    if (this.items) {
      return;
    }
    item.subItemsInvisible = !item.subItemsInvisible;
  }
}
