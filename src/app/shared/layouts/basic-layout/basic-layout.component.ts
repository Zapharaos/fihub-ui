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

interface Country {
  name: string,
  code: string
}

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
  ],
    templateUrl: './basic-layout.component.html',
    styleUrl: './basic-layout.component.scss'
})
export class BasicLayoutComponent {

  protected readonly logoPath = "assets/svg/logo-initial.svg";
  sidebarVisible: boolean = true;
  @Input() items: LayoutItem[] | undefined;
  @Input() actionsTemplate!: TemplateRef<any>;

  countries: Country[] = [
    { name: 'Australia', code: 'AU' },
    { name: 'Brazil', code: 'BR' },
    { name: 'China', code: 'CN' },
    { name: 'Egypt', code: 'EG' },
    { name: 'France', code: 'FR' },
    { name: 'Germany', code: 'DE' },
    { name: 'India', code: 'IN' },
    { name: 'Japan', code: 'JP' },
    { name: 'Spain', code: 'ES' },
    { name: 'United States', code: 'US' }
  ];
  selectedCountry!: Country;

  constructor(
    private router: Router,
    protected themeService: ThemeService,
    protected authService: AuthService,
  ) { }

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

  isSubItemActive(item: any): boolean {
    if (!item.items) {
      return false;
    }
    return item.items.some((subItem: any) => this.router.isActive(subItem.route, { paths: 'subset', queryParams: 'ignored', fragment: 'ignored', matrixParams: 'ignored' }));
  }

  isItemOpen(item: LayoutItem): boolean {
    return this.isSubItemActive(item) || !item.subItemsInvisible;
  }
}
