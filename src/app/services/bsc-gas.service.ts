import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BscGasService {

  private API_KEY = environment.API_KEY_BSC;

  constructor(
    private http: HttpClient
  ) { }


  /**
   * @dev Get gas price from BSC
   * @returns 
   */
  getGasPrice() {
    return this.http.get(`https://api.bscscan.com/api?module=gastracker&action=gasoracle&apikey=${this.API_KEY}`).toPromise();
  }

}
