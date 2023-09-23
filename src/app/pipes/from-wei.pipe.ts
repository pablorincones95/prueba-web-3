import { Pipe, PipeTransform } from '@angular/core';
import { fromWei } from '../helpers/utils';

@Pipe({
  name: 'fromWei'
})
export class FromWeiPipe implements PipeTransform {

  transform(value: any): string {
    return fromWei(value, 18);
  }

}

