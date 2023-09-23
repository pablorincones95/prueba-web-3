import { Pipe, PipeTransform } from '@angular/core';
import { catchError, from, Observable, of, tap } from 'rxjs';
import { Web3Service } from '../services/contract/web3.service';

@Pipe({
  name: 'userContractRoles'
})
export class UserContractRolesPipe implements PipeTransform {

  constructor(
    private web3Srv: Web3Service
  ) { }

  async getUserRoles(addr: string){
    try {
      const [
        isAdmin,
        isUser
      ] = await Promise.all([
        this.web3Srv.mainred_security_isAdmin(),
        this.web3Srv.mainred_security_isUser(),
      ]);

      return {isAdmin, isUser};
      
    } catch (err) {
      console.log('Error on getUserRoles', err);
      return {isUser: false, isAdmin: false};
    }
  }

  transform(addr: string): Observable<any> {
    return from(this.getUserRoles(addr))
    .pipe(
      // tap((data) => console.log('userContractRoles', data)),
      catchError((err) => of({isUser: false, isAdmin: false}))
    )
  }

}
