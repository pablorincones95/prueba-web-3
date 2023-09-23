import { Pipe, PipeTransform } from '@angular/core';
import BigNumber from 'bignumber.js';
import { catchError, from, Observable, of, switchMap } from 'rxjs';
import { Web3Service } from '../services/contract/web3.service';

@Pipe({
  name: 'packageIdBlockDocument'
})
export class PackageIdBlockDocumentPipe implements PipeTransform {

  constructor(
    private web3Srv: Web3Service
  ) { }

  transform(index: any): Observable<any> {
    return from(this.web3Srv.mainred_packages_WhitelistPackage(index))
    .pipe(
      switchMap(async(data) => {
        if(!data){ return {}; }

        const packageFee = await this.web3Srv.mainred_packages_getPackageFee();
        return {...data, price: new BigNumber(data.price).minus(packageFee).toFixed()}
      }),
      catchError((err) => of({}))
    )
  }
}
