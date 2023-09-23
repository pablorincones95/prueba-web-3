import { Pipe, PipeTransform } from '@angular/core';
import { Web3Service } from '../services/contract/web3.service';

@Pipe({
  name: 'erc20'
})
export class Erc20Pipe implements PipeTransform {

  constructor(
    private web3Srv: Web3Service,
  ) { }

  async transform(address: string, field: string): Promise<any> {

    return await this.web3Srv.calculateAndCallCustomABI({
      contractAddress: address,
      method: field,
      callType: 'call',
      optionals: null,
      urlABI: this.web3Srv.erc20ABI
    });
    // return await this.contractSrv.getMethod(address, field, this.contractSrv.erc20ABI);
  }

}
