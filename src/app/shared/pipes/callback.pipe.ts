import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'callback'
})
export class CallbackPipe implements PipeTransform {

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  transform(items: any[], callback: (item: any) => boolean): any {
    if (!items || !callback) {
      return items;
    }
    return items.filter(item => callback(item));
  }

}
