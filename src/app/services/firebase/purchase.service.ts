import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  constructor(
    private http: HttpClient
  ) { }

  /**
   * Obtener monto total de compras de un usuario
   * @param addr      Wallet
   * @returns 
   */
  async getTotalUserPurchasesAmount(addr: string): Promise<number>{
    try {
      const url = `${environment.API_URL}/api/v1/purchases/total-user-purchases`;
      const snapshot: any = await lastValueFrom(this.http.post(url, {addr}));
      return snapshot.results.total;
      
    } catch (err) {
      console.log('Error on PurchasesService.getTotalUserPurchasesAmount', err);
      return 0;
    }
  }

  /**
   * 
   * @param addr 
   * @returns 
   */
  async getUserPurchasesPaginated(addr: string, size: number = 10, page: number = 1): Promise<any>{
    try {
      const url = `${environment.API_URL}/api/v1/purchases/user-purchases`;
      const snapshot: any = await lastValueFrom(this.http.post(url, {addr, size, page}));

      const { results } = snapshot;
      const maxPages = Math.ceil(results.total / size);
      return {
        page: page,
        size: size,
        total: results.total,
        rows: results.rows,
        back: (page > 1),
        next: (maxPages > page)
      };
      
    } catch (err) {
      console.log('Error on PurchasesService.getUserPurchasesPaginated', err);
      return {
        page: page,
        size: size,
        total: 0,
        rows: [],
        back: false,
        next: false
      }
    }
  }

  async getUserDirectBonusRecordsPaginated(addr: string, size: number = 10, page: number = 1): Promise<any>{
    try {
      const url = `${environment.API_URL}/api/v1/purchases/user-direct-bonus`;
      const snapshot: any = await lastValueFrom(this.http.post(url, {addr, size, page}));

      const { results } = snapshot;
      const maxPages = Math.ceil(results.total / size);
      return {
        page: page,
        size: size,
        total: results.total,
        rows: results.rows,
        back: (page > 1),
        next: (maxPages > page)
      };
      
    } catch (err) {
      console.log('Error on PurchasesService.getUserDirectBonusRecordsPaginated', err);
      return {
        page: page,
        size: size,
        total: 0,
        rows: [],
        back: false,
        next: false
      }
    }
  }

}
