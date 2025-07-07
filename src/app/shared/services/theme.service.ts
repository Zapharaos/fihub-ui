import {Injectable} from '@angular/core';
import {LocalStorageKeys} from "@shared/models/local-storage";

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkTheme = false;
  private readonly localStorageKey = LocalStorageKeys.Theme;

  init() {
    // Trying to retrieve the theme from local storage
    const storedTheme = this.getTheme();
    if (storedTheme) {
      this.isDarkTheme = storedTheme === 'dark';
    }
    // Nothing in local storage : defaults to preferred color scheme
    else {
      this.isDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    // Apply theme without saving
    this.applyTheme();
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    this.applyTheme();
    this.saveTheme();
  }

  isLight(): boolean {
    return !this.isDarkTheme;
  }

  private getTheme(): string | undefined {
    return localStorage.getItem(this.localStorageKey) || undefined;
  }

  private applyTheme(): void {
    const element = document.querySelector('html');
    if (this.isDarkTheme) {
      element?.classList.add('p-dark');
    } else {
      element?.classList.remove('p-dark');
    }
  }

  private saveTheme(): void {
    localStorage.setItem(this.localStorageKey, this.isDarkTheme ? 'dark' : 'light');
  }
}
