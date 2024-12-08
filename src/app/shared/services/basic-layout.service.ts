import {EventEmitter, Injectable} from '@angular/core';
import {MenuItem} from "primeng/api";

@Injectable({
  providedIn: 'root'
})
export class BasicLayoutService {
  private breadcrumbItems: MenuItem[] = [];
  public breadcrumbItemsChanged = new EventEmitter<MenuItem[]>();

  constructor() { }

  setBreadcrumbItems(items?: MenuItem[]) {
    this.breadcrumbItems = items ?? [];
    this.breadcrumbItemsChanged.emit(this.breadcrumbItems);
  }

  getBreadcrumbItems() {
    return this.breadcrumbItems;
  }
}
