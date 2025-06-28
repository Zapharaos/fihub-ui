import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {LocalStorageKeys} from "@shared/models/local-storage";

export interface AuthOtpStoreRequest {
  identifier?: string;
  requestID?: string;
  expiresAt?: string;
  currentStepIndex?: number;
}

export enum AuthRequestKey {
  ChangePassword = 'changePassword',
  ResetPassword = 'resetPassword',
  RegisterUser = 'registerUser',
}

@Injectable({
  providedIn: 'root'
})
export class AuthOtpStore {

  private readonly localStorageKey = LocalStorageKeys.AuthOtp;
  private lsRequests: Map<string, AuthOtpStoreRequest> = new Map();
  private readonly _requests = new Map<string, BehaviorSubject<AuthOtpStoreRequest | null>>();

  get(key: string): AuthOtpStoreRequest | undefined {
    return this._requests.get(key)?.getValue() ?? undefined;
  }

  getAsObservable(key: string):  Observable<AuthOtpStoreRequest | null> | undefined {
    // If the request does not exist, create a new BehaviorSubject
    if (!this._requests.has(key)) {
      this._requests.set(key, new BehaviorSubject<AuthOtpStoreRequest | null>(null));
    }
    return this._requests.get(key)?.asObservable();
  }

  set(key: string, request: AuthOtpStoreRequest | undefined) {
    // If the request did not exist, create an entry in the map
    if (!this._requests.has(key)) {
      this._requests.set(key, new BehaviorSubject<AuthOtpStoreRequest | null>(null));
    }
    // Update the BehaviorSubject with the new request
    this._requests.get(key)?.next(request ?? null);
    this.setLocalStorage(key, request);
  }

  reset(key: string) {
    this.set(key, undefined)
  }

  init(key: string) {
    // Retrieve the request from localStorage
    const localRequest = this.getLocalStorage(key);

    // If the request is not expired, set it to the BehaviorSubject
    if (localRequest && !AuthOtpStore.isRequestExpired(localRequest)) {
      this.set(key, localRequest);
    }
  }

  static isRequestExpired(request: AuthOtpStoreRequest | undefined): boolean {
    if (!request || !request.expiresAt) {
      return false;
    }

    const now = new Date();
    const expiresAt = new Date(request.expiresAt);
    return now > expiresAt;
  }

  private getLocalStorage(key: string): AuthOtpStoreRequest | undefined{
    // Retrieve the stored data from localStorage
    const storedData = localStorage.getItem(this.localStorageKey);
    // If no data is found or it's undefined, return undefined
    if (!storedData || storedData === "undefined") {
      return undefined;
    }
    try {
      // Parse the stored data and retrieve the specific request by key
      this.lsRequests = new Map(JSON.parse(storedData));
      return this.lsRequests.get(key) ?? undefined;
    } catch (e) {
      console.error('Error parsing localStorage data', e);
      return undefined;
    }
  }

  private setLocalStorage(key: string, data: AuthOtpStoreRequest | undefined): void {
    // Update the mapRequest with the new data
    if (!data) {
      this.lsRequests.delete(key);
    } else {
      this.lsRequests.set(key, data);
    }
    // Save the updated map to localStorage
    localStorage.setItem(this.localStorageKey, JSON.stringify(Array.from(this.lsRequests.entries())));
  }
}
