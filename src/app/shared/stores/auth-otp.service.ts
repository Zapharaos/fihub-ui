import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

export interface AuthOtpStoreRequest {
  identifier?: string;
  requestID?: string;
  expiresAt?: string;
  currentStepIndex?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthOtpStore {

  private readonly localStorageKey = 'passwordReset';
  private readonly _request = new BehaviorSubject<AuthOtpStoreRequest | null>(null);
  readonly request$ = this._request.asObservable();

  get request(): AuthOtpStoreRequest | undefined {
    return this._request.getValue() ?? undefined;
  }

  set request(request: AuthOtpStoreRequest | undefined) {
    this._request.next(request ?? null);
    this.setLocalStorage(request);
  }

  init() {
    // Retrieve the request from localStorage
    const localRequest = this.getLocalStorage();

    // If the request is not expired, set it to the BehaviorSubject
    if (localRequest && !AuthOtpStore.isRequestExpired(localRequest)) {
      this._request.next(localRequest);
    }
  }

  reset() {
    this.request = undefined;
  }

  static isRequestExpired(request: AuthOtpStoreRequest | undefined): boolean {
    if (!request || !request.expiresAt) {
      return false;
    }

    const now = new Date();
    const expiresAt = new Date(request.expiresAt);
    return now > expiresAt;
  }

  private getLocalStorage(): AuthOtpStoreRequest | undefined{
    const storedData = localStorage.getItem(this.localStorageKey);
    if (!storedData || storedData === "undefined") {
      return undefined;
    }
    try {
      return JSON.parse(storedData);
    } catch (e) {
      console.error('Error parsing localStorage data', e);
      return undefined;
    }
  }

  private setLocalStorage(data: AuthOtpStoreRequest | undefined): void {
    if (!data) {
      localStorage.removeItem(this.localStorageKey);
    }
    localStorage.setItem(this.localStorageKey, JSON.stringify(data));
  }
}
