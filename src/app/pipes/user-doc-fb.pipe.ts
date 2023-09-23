import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from '../services/firebase/user.service';

@Pipe({
  name: 'userDocFb'
})
export class UserDocFbPipe implements PipeTransform {

  constructor(
    private userSrv: UserService
  ) { }

  transform(addr: string): Observable<any> {
    return this.userSrv.getById(addr)
  }

}
