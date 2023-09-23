import { Pipe, PipeTransform } from '@angular/core';
import { catchError, from, Observable, of } from 'rxjs';
import { Web3Service } from '../services/contract/web3.service';

@Pipe({
  name: 'packageBlockDocument'
})
export class PackageBlockDocumentPipe implements PipeTransform {

  constructor(
    private web3Srv: Web3Service
  ) { }

  transform(addr: string): Observable<any> {
    return from(this.web3Srv.mainred_packages_getPackage(addr))
    .pipe(
      catchError((err) => of({}))
    )
  }

}