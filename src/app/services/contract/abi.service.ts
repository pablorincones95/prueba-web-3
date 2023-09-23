import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AbiService {

  constructor(private http: HttpClient) { }


  /**
   * Obtener ABI por defecto
   * @returns 
   */
  getABI() {
    return new Promise((resolve, reject) => {
      try {
        this.http.get<any>(environment.configUrlAbi)
          .subscribe((res: any) => {
            resolve(res.abi);
          })
      } catch (error) {
        alert(JSON.stringify(error))
        reject(error)
      }
    })
  }


  /**
   * Obtener ABI a través de una ruta
   * @param urlAbi            Path del ABI
   * @returns 
   */
  getABIByUrl(urlAbi: string) {
    return new Promise((resolve, reject) => {
      try {
        this.http.get<any>(urlAbi)
          .subscribe((res: any) => {
            resolve(res.abi);
          })
      } catch (error) {
        alert(JSON.stringify(error))
        reject(error)
      }
    })
  }


  async parseABI(url: string) {
    const abi: any = await this.getABIByUrl(url);

    const newABI: any = {};

    for (const [idx, value] of Object.entries(abi)) {
      const row: any = value;
      const prop: any = (Object.prototype.hasOwnProperty.call(row, 'name')) ? row.name : row.type;

      newABI[prop] = row;
    }

    return newABI;
  }
}
