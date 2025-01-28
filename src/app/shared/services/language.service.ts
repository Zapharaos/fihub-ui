import { Injectable } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import languages from 'assets/config/languages.json';

interface Language {
  name: string,
  code: string
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private defaultLanguage = 'en';
  languages: Language[] = [];
  language: Language | undefined;

  constructor(
    private translateService: TranslateService,
  ) {
    // Load the languages from the JSON file
    this.languages = languages;

    // Retrieve the language codes
    const languageCodes = this.languages.map(l => l.code);

    // Setup translate service
    this.translateService.addLangs(languageCodes);
    this.translateService.setDefaultLang(this.defaultLanguage);
  }

  init() {
    // Trying to retrieve the language from local storage
    const language = this.getLanguage();

    // Nothing in local storage : defaults to preferred color scheme
    if (!language) {
      const languageCode = this.translateService.getBrowserLang() || this.defaultLanguage;
      this.language = this.languages.find(language => language.code === languageCode);
    }

    // Apply language without saving
    this.applyLanguage();
  }

  setLanguage(language: Language): void {
    this.language = language;
    localStorage.setItem('language', language.code);
  }

  private getLanguage(): string | undefined {
    return localStorage.getItem('language') || undefined;
  }

  private applyLanguage() {
    if (this.language) {
      this.translateService.use(this.language.code);
    }
  }
}
