import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { fromGwei, toGwei, toWei } from '../helpers/utils';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  // @dev
  apiGetGasPrices() {
    return new Promise((resolve, reject) => {
      try {
        this.http.get<any>("https://gpoly.blockscan.com/gasapi.ashx?apikey=key&method=pendingpooltxgweidata")
          .subscribe((res: any) => {
            resolve({
              low: res.result.standardgaspricegwei / 10,
              medium: res.result.fastgaspricegwei / 10,
              high: res.result.rapidgaspricegwei / 10
            });
          })
      } catch (error) {
        alert(JSON.stringify(error))
        reject(error)
      }
    })
  }

  // @dev
  async actualNetworkFee() {
    return new Promise(async (resolve) => {
      let gasPrices: any = await this.apiGetGasPrices();
      let low = parseFloat(((21000 * gasPrices.low) / 1e9).toFixed(8));
      let medium = parseFloat(((21000 * gasPrices.medium) / 1e9).toFixed(8));
      let high = parseFloat(((21000 * gasPrices.high) / 1e9).toFixed(8));

      let fee = { low, medium, high };
      console.log('Ether fee', fee)
      resolve(fee)
    })
  }

  /// @dev post to api
  async postToApi(data: any) {
    console.log('data', data)
    console.log('url', environment.API_GEMYN)
    return new Promise((resolve, reject) => {
      try {
        this.http.post<any>(environment.API_GEMYN, JSON.stringify(data))
          .subscribe((res: any) => {
            return resolve(res);
          })
      } catch (error) {
        return reject(error)
      }
    })
  }

  // // @dev
  // apiGetAccountAssets(address: string, chainId: number) {
  //   return new Promise((resolve, reject) => {
  //     try {
  //       this.http.get<any>("https://ethereum-api.xyz" + `/account-assets?address=${address}&chainId=${chainId}`)
  //         .subscribe((res: any) => {
  //           resolve(res.abi);
  //         })
  //     } catch (error) {
  //       alert(JSON.stringify(error))
  //       reject(error)
  //     }
  //   })
  // }

  // // @dev
  // apiGetAccountTransaction(address: string, chainId: number) {
  //   return new Promise((resolve, reject) => {
  //     try {
  //       this.http.get<any>("https://ethereum-api.xyz" + `/account-transactions?address=${address}&chainId=${chainId}`)
  //         .subscribe((res: any) => {
  //           resolve(res.abi);
  //         })
  //     } catch (error) {
  //       alert(JSON.stringify(error))
  //       reject(error)
  //     }
  //   })
  // }

  // // @dev
  // apiGetAccountNonce(address: string, chainId: number) {
  //   return new Promise((resolve, reject) => {
  //     try {
  //       this.http.get<any>("https://ethereum-api.xyz" + `/account-nonce?address=${address}&chainId=${chainId}`)
  //         .subscribe((res: any) => {
  //           resolve(res.abi);
  //         })
  //     } catch (error) {
  //       alert(JSON.stringify(error))
  //       reject(error)
  //     }
  //   })
  // }
}
