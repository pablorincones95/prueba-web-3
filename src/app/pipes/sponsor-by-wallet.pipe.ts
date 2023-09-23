import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { Web3Service } from '../services/contract/web3.service';

@Pipe({
  name: 'sponsorByWallet'
})
export class SponsorByWalletPipe implements PipeTransform {

  constructor(
    private web3Srv: Web3Service
  ) {}

  transform(addr: string): Promise<string> {
    return this.web3Srv.mainred_user_getReferredByWallet(addr);
  }

}
