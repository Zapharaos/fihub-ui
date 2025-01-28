import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

export enum PasswordStoreStep {
  Forgot = 'forgot',
  Verify = 'verify',
  Reset = 'reset'
}

export interface PasswordStoreRequest {
  userID: string;
  requestID?: string;
  expiresAt: string;
  step: PasswordStoreStep;
}

@Injectable({
  providedIn: 'root'
})
export class PasswordStore {

  private readonly localStorageKey = 'passwordReset';
  private readonly _request = new BehaviorSubject<PasswordStoreRequest | null>(null);
  readonly request$ = this._request.asObservable();

  constructor() { }

  get request(): PasswordStoreRequest | undefined {
    return this._request.getValue() ?? undefined;
  }

  set request(request: PasswordStoreRequest | undefined) {
    this._request.next(request ?? null);
    this.setLocalStorage(request);
  }

  init() {
    // Retrieve the request from localStorage
    const localRequest = this.getLocalStorage();

    // If the request is not expired, set it to the BehaviorSubject
    if (localRequest && !this.isRequestExpired(localRequest)) {
      this._request.next(localRequest);
    }

    this.reset();
  }

  reset() {
    this.request = undefined;
  }

  private isRequestExpired(request: PasswordStoreRequest): boolean {
    if (!request) {
      return true;
    }

    const now = new Date();
    const expiresAt = new Date(request.expiresAt);
    return now > expiresAt;
  }

  private getLocalStorage(): PasswordStoreRequest | undefined{
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

  private setLocalStorage(data: PasswordStoreRequest | undefined): void {
    if (!data) {
      localStorage.removeItem(this.localStorageKey);
    }
    localStorage.setItem(this.localStorageKey, JSON.stringify(data));
  }
}
