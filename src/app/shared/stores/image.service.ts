import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ImageStore {

  private readonly _brokerImages = new BehaviorSubject<Map<string, string>>(new Map());
  readonly brokerImages$ = this._brokerImages.asObservable();

  get brokerImages(): Map<string, string> {
    return this._brokerImages.getValue();
  }

  set brokerImages(val: Map<string, string>) {
    this._brokerImages.next(val);
  }
}
