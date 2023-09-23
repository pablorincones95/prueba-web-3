import { Pipe, PipeTransform } from '@angular/core';
import { catchError, from, map, Observable, of, switchMap, tap } from 'rxjs';
import { PurchaseService } from '../services/firebase/purchase.service';

@Pipe({
  name: 'isBasicPackage'
})
export class IsBasicPackagePipe implements PipeTransform {

  constructor(
    private purchaseSrv: PurchaseService
  ) { }

  transform(addr: string): Observable<any> {
    return from(this.purchaseSrv.getTotalUserPurchasesAmount(addr))
    .pipe(
      map((amount: any) => ({isBasic: (amount <= 50), addr})),
      // tap((data) => console.log('IsBasicPackagePipe', data)),
      catchError((err) => of({isBasic: true, addr}))
    );
  }
  
  // transform(addr: string): Observable<any> {
  //   return this.packageSrv.getById(addr)
  //   .pipe(
  //     map((data: any) => {
  //       if(!data){ return { isBasic: true, addr}; }
  //       return { isBasic: (data.amount <= 50), addr}
  //     }),
  //     // tap((data) => console.log('IsBasicPackagePipe', data))
  //   )
  // }

}
