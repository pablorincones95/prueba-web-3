import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { fromWei, toWei } from './helpers/utils';
import { CommonService } from './services/common.service';
import { AbiService } from './services/contract/abi.service';
import { Web3Service } from "./services/contract/web3.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  authenticated: boolean = false;
  data: string[] | undefined;

  constructor(
    private commonService: CommonService,
    private web3: Web3Service,
    private abiSrv: AbiService,
  ) {

    console.log("MAIN:", environment.chain.chainId);
    console.log("MAIN:", environment.chain.rpc);
  }

  async ngOnInit(): Promise<void> {
  
  }


  async parseABI() {
    // const r = await this.abiSrv.parseABI('/assets/abi/NexChain.json');
    const r = await this.abiSrv.parseABI(this.web3.ncwABI);
    console.log(r);
  }




}
