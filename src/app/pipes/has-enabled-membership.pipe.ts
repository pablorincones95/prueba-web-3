import { Pipe, PipeTransform } from '@angular/core';
import { from, map, Observable, tap } from 'rxjs';
import { Web3Service } from '../services/contract/web3.service';
import { MembershipService } from '../services/firebase/membership.service';

@Pipe({
  name: 'hasEnabledMembership'
})
export class HasEnabledMembershipPipe implements PipeTransform {

  constructor(
    private membershipSrv: MembershipService,
    private web3Srv: Web3Service,
  ) { }

  transform(addr: string): Observable<any> {
    return from(this.web3Srv.mainred_membership_isActiveMembership(addr))
    .pipe(
      // tap((data) => console.log('mainred_membership_isActiveMembership', data)),
      map((data: any) => (!data) ? { hasMembreship: false, addr } : { hasMembreship: true, addr})
    )
  }
  // transform(addr: string): Observable<any> {
  //   console.log('addr', addr);
  //   return this.membershipSrv.getByAddr(addr)
  //   .pipe(
  //     tap((data) => console.log('data', data)),
  //     map((data) => (data) ? {hasMembership: true, addr,  ...data} : {hasMembership: false, addr}),
  //   )
  // }

}
