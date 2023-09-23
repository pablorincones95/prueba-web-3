import { Injectable } from '@angular/core';
import { toWei } from '../helpers/utils';


@Injectable({
  providedIn: 'root'
})
export class CommonService {

  public thumbLoader = 'assets/img/thumb-loader.png';

  public founderVIP = 'assets/img/founder-vip.png';

  public founderAmbassador = 'assets/img/founder-ambassador.png';


  decimalList = [
    {
      pairId: 1,
      decimal: 18
    }, {
      pairId: 2,
      decimal: 18
    }, {
      pairId: 3,
      decimal: 18
    },
  ]


  constructor() { }

  /**
   * @dev get version
   * @returns 
   */
  getVersion() { 
    return '0.0.1.2';
  }



  /**
   * funcion provisonal para convertir a wei
   */
  _towei(_amount: any = []) {
    let result = []
    for (let index = 0; index < _amount.length; index++) {
      const element = _amount[index];
      result.push(toWei(element))

    }
    console.log(result);
  }


  getParameterByName(name: any) {
    let url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }


  /**
   * @name getAddress
   * @param address 
   * @returns 
   */
  getAddress(address: string) {
    if (!address) { return ''; }
    return address.substring(0, 6) + '...' + address.substring(address.length - 4, address.length)
  }


  /**
   * 
   * @param sourceString 
   * @returns 
   */
  removeSpecialCharacters(sourceString: string): string {
    return sourceString
      .replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '')
      .replace(/\s/g, '')
      .toLocaleLowerCase();
  }


  /**
   * 
   * @param name 
   * @returns 
   */
  getPrimeraLetra(name: string) {
    if (!name) { return ''; }
    return name.charAt(0).toUpperCase()

  }

}
