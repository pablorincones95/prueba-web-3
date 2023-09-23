import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Web3Service } from '../services/contract/web3.service';

@Injectable({
  providedIn: 'root'
})
export class CheckWeb3ConnectionGuard implements CanActivate {

  constructor(
    private contractSrv: Web3Service,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.contractSrv.accounts) { return true; }
    // return false;
    return this.router.navigate(["/admin/dashboard"]);
  }

}
