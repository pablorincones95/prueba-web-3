import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ReportWithdrawOrderService {

  constructor(
    private apiSrv: ApiService,
  ) { }

  async getDates(){
    const snapshot = await this.apiSrv.post('/report/withdraw-order/dates', {});
    return snapshot.dates;
  }

  async getRecordsByDate(date: string, size: number = 10, page: number = 1, filter = {}): Promise<any>{
    try {
      const snapshot = await this.apiSrv.post('/report/withdraw-order/records', {
        date, size, page, filter
      });

      return {
        ...snapshot,
        filter,
        back: (snapshot.page > 1),
        next: (snapshot.pages > page)
      }
    } catch (err) {
      console.log('Error on ReportWithdrawOrderService.getRecordsByDate', err);
      return {
        date: date,
        filter: filter,
        page: page,
        pages : 0,
        size: size,
        total: 0,
        rows: [],
        back: false,
        next: false
      }
    }
  }
}
