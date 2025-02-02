import {Component, Input, TemplateRef} from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {ButtonModule} from "primeng/button";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {Ripple} from "primeng/ripple";
import {TranslateModule} from "@ngx-translate/core";
import {LayoutItem} from "@shared/models/layout-item";
import {FooterComponent} from "@shared/components/footer/footer.component";
import {ThemeService} from "@shared/services/theme.service";
import {AuthService} from "@core/services/auth.service";
import {Listbox} from "primeng/listbox";
import {FormsModule} from "@angular/forms";
import {PanelComponent} from "@shared/components/panel/panel.component";
import {LanguageService} from "@shared/services/language.service";
import {CallbackPipe} from "@shared/pipes/callback.pipe";

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
    Listbox,
    FormsModule,
    PanelComponent,
    CallbackPipe,
  ],
    templateUrl: './basic-layout.component.html',
    styleUrl: './basic-layout.component.scss'
})
export class BasicLayoutComponent {

  protected readonly logoPath = "assets/svg/logo-initial.svg";
  sidebarVisible = true;
  @Input() items: LayoutItem[] | undefined;
  @Input() actionsTemplate!: TemplateRef<unknown>;

  constructor(
    private router: Router,
    protected themeService: ThemeService,
    protected authService: AuthService,
    protected languageService: LanguageService,
  ) {
    // If the permissions change, we need to re-evaluate the permissions of the items
    this.authService.permissions$.subscribe(() => {
      this.filterPermission = this.filterPermission.bind(this);
    });
  }

  filterPermission = (item: LayoutItem): boolean => {
    if (!item.permission) return true;
    return this.authService.currentUserHasPermission(item.permission);
  }

  home() {
    this.router.navigate(['/']);
  }

  toggleSidebar() {
    if (!this.items) {
      return;
    }
    this.sidebarVisible = !this.sidebarVisible;
  }

  toggleSubItems(item: LayoutItem) {
    if (!this.items) {
      return;
    }
    item.subItemsInvisible = !item.subItemsInvisible;
  }

  isSubItemActive(item: LayoutItem): boolean {
    if (!item.items) {
      return false;
    }
    return item.items.some((subItem: LayoutItem) => this.router.isActive(subItem.route!, { paths: 'subset', queryParams: 'ignored', fragment: 'ignored', matrixParams: 'ignored' }));
  }

  isItemOpen(item: LayoutItem): boolean {
    return this.isSubItemActive(item) || !item.subItemsInvisible;
  }
}
