import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { PackageService } from '../services/firebase/package.service';

@Pipe({
  name: 'userPackFb'
})
export class UserPackFbPipe implements PipeTransform {

  constructor(
    private packageSrv: PackageService
  ) { }

  transform(addr: string): Observable<any> {
    return this.packageSrv.getById(addr)
  }

}
