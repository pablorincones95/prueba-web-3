import { Pipe, PipeTransform } from '@angular/core';
import { toWei, fromWei, getDateFromBlock, fromBasicPoint } from '../helpers/utils';
@Pipe({
  name: 'web3Utils'
})
export class Web3UtilsPipe implements PipeTransform {


  constructor() { }

  transform(value: string, type: string) {
    if (type == "toWei") {
      return toWei(value, 18);
    } else if (type == "fromWei") {
      return fromWei(value, 18);
    } else if (type == 'dateFromBlock') {
      return getDateFromBlock(value);
    } else if (type == 'fromBasicPoint') {
      return fromBasicPoint(value);
    }

    return "N/A";
  }
}

