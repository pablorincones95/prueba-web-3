import { Pipe, PipeTransform } from '@angular/core';
import { from, map, Observable, tap } from 'rxjs';
import { Web3Service } from '../services/contract/web3.service';
import { PackageService } from '../services/firebase/package.service';

@Pipe({
  name: 'hasBuyPackages'
})
export class HasBuyPackagesPipe implements PipeTransform {

  constructor(
    private web3Srv: Web3Service,
    private packageSrv: PackageService
  ) { }


  transform(addr: string): Observable<any> {
    return this.packageSrv.getById(addr)
    .pipe(
      tap((data) => console.log('PackageService.getById', data)),
      map((data: any) => (data == 0) ? { hasBuyPackages: false, addr } : { hasBuyPackages: true, addr})
    )
  }
  // transform(code: string): Observable<any> {
  //   return from(this.web3Srv.mainred_sale_countMyBuyByUserCode(code))
  //   .pipe(
  //     // tap((data) => console.log('mainred_membership_isActiveMembership', data)),
  //     map((data: any) => (data == 0) ? { hasBuyPackages: false, code } : { hasBuyPackages: true, code})
  //   )
  // }

}
