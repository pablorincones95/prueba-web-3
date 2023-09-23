import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import BigNumber from 'bignumber.js';
import { NgxSpinnerService } from 'ngx-spinner';
import { env } from 'process';
import { fromWei, toWei } from 'src/app/helpers/utils';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { Web3Service } from 'src/app/services/contract/web3.service';
import { Sweetalert2Service } from 'src/app/services/sweetalert2.service';
import { Sweetalert2stepsService } from 'src/app/services/sweetalert2steps.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-recharge',
  templateUrl: './recharge.component.html',
  styleUrls: ['./recharge.component.css']
})
export class RechargeComponent implements OnInit {


  public obj: any = {
    amount: "",
    idUser: "",
    tandC: false,
    wallet: ""
  }
  tokenAddress: any
  account: any;

  constructor(
    private sweetalert2Srv: Sweetalert2Service,
    private apiService: ApiService,
    public commonService: CommonService,
    public fb: FormBuilder,
    public web3Srv: Web3Service) {



    /**
     * ?id=103&value=20&wallet=0xF6EDfDece76539e6B91820466BBEf0470316e0a1
      */
    this.obj.idUser = this.commonService.getParameterByName("id")
    this.obj.wallet = this.commonService.getParameterByName("wallet")
    this.obj.amount = this.commonService.getParameterByName("value")
    this.tokenAddress = environment.contractAddress
    // this.account = this.web3Srv.accounts
    console.log("this.obj", this.obj)

  }

  async ngOnInit(): Promise<void> {

  }

  /**
   * @dev send token 
   * @returns 
   */
  async sendToken() {
    try {
      const validate = this.validate();
      if (!validate) { return; }

      this.sweetalert2Srv.showLoading()

      const res = await this.web3Srv
        .sendToken(environment.contractAddress, environment.walletRoot, this.obj.amount)

      console.log({
        res
      })

      const tx = res.tx.transactionHash
      console.log("tx", tx)

      await this.sendReponse(res.amount, res.amountToSend, true, res.fromAddress, tx)
      this.sweetalert2Srv.closeLoading()

      this.sweetalert2Srv.showSuccess("Token sent successfully")

      setTimeout(function () {
        window.location.href = environment.url_redirecion;
      }, 3000);  // 5000 milisegundos = 5 segundos

    }
    catch (err) {
      this.sweetalert2Srv.closeLoading()
      console.log("err", err)
      this.sendReponse(0, 0, false, this.obj.wallet)
      this.sweetalert2Srv.showError("Error sending token")
      return
    }
  }

  /**
   * 
   * @param amount_in_wei 
   * @param amount_in_eth 
   * @param status 
   * @returns 
   */
  async sendReponse(amount_in_wei = 0, amount_in_eth = 0, status = false, wallet: any, tx = null) {

    const obj = {
      amount_in_wei, // amount in wei
      amount_in_eth, // amount in eth
      tx: tx, // ts has 
      when: Date.now(), // when
      id_transaction: this.obj.idUser, // id transaction
      wallet, // wallet
      status, // status: true: transacion aprobada o  false: transacion rechazada
      key: environment.AUTH_KEY_GEMYN_API // key
    }

    console.log("obj", obj)

    const res = await this.apiService.postToApi(obj)
    console.log("res", res)

    return res
  }


  /**
   * @dev validate form
   * @returns 
   */
  validate() {
    console.log("obj", this.obj)
    console.log("this.web3Srv.accounts", this.web3Srv.accounts)
    if (this.web3Srv.accounts == undefined) {
      this.sweetalert2Srv.showError("Please connect your wallet")
      this.launch()
      return false
    } else if (this.obj.amount <= 0 || this.obj.amount == undefined) {
      this.sweetalert2Srv.showError("Please enter the amount")
      return false
    } else if (this.obj.idUser == undefined) {
      this.sweetalert2Srv.showError("Please enter the id")
      return false
    } else if (!this.obj.tandC) {
      this.sweetalert2Srv.showError("Please accept the terms and conditions")
      return false
    }
    return true
  }



  /**
   * 
   */
  async launch() { return this.web3Srv.launchAskConnectionType(); }





  goToHome() {
    window.location.href = "https://gemynplay.web.app/"
  }


  addChainId() {

  }

  addToken() { }



}
