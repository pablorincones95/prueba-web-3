import { Pipe, PipeTransform } from '@angular/core';
import { from, map, Observable, switchMap, tap } from 'rxjs';
import { Web3Service } from '../services/contract/web3.service';
import { UserService } from '../services/firebase/user.service';

@Pipe({
  name: 'isUserRegistered'
})
export class IsUserRegisteredPipe implements PipeTransform {

  constructor(
    private web3Srv: Web3Service,
    private userSrv: UserService,
  ) { }

  // transform(addr: string): Observable<any> {
  //   return this.userSrv.getById(addr)
  //   .pipe(
  //     map((data: any) => (!data) ? { isRegistered: false, addr } : { isRegistered: true, addr, ...data }),
  //   )
  // }

  transform(addr: string): Observable<any> {
    return from(this.web3Srv.mainred_user_getByAddress(addr))
    .pipe(
      // tap((data) => console.log('data', data)),
      map((data: any) => (!data) ? { isRegistered: false, addr } : { isRegistered: true, addr, ...data })
    )
  }

}
