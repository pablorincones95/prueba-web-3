import { Pipe, PipeTransform } from '@angular/core';
import { from, map, Observable, tap } from 'rxjs';
import { Web3Service } from '../services/contract/web3.service';

@Pipe({
  name: 'hasBuyPackagesBlock'
})
export class HasBuyPackagesBlockPipe implements PipeTransform {

  constructor(
    private web3Srv: Web3Service,
  ) { }


  transform(code: string): Observable<any> {
    return from(this.web3Srv.mainred_sale_countMyBuyByUserCode(code))
    .pipe(
      // tap((data) => console.log('mainred_sale_countMyBuyByUserCode', data)),
      map((data: any) => (data == 0) ? { hasBuyPackages: false, code } : { hasBuyPackages: true, code})
    )
  }

}
