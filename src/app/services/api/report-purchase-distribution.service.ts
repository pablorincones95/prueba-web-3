import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ReportPurchaseDistributionService {

  constructor(
    private apiSrv: ApiService,
  ) { }

  async getRecordsByDate(startAt: string, endAt: string, size: number = 10, page: number = 1, filter = {}): Promise<any>{
    try {
      const snapshot = await this.apiSrv.post('/report/purchase-distribution/records', {
        startAt, endAt, size, page, filter
      });

      // console.log('snapshot', snapshot);

      return {
        ...snapshot,
        filter,
        back: (snapshot.page > 1),
        next: (snapshot.pages > page)
      }
    } catch (err) {
      console.log('Error on ReportPurchaseDistributionService.getRecordsByDate', err);
      return {
        startAt: startAt,
        endAt: endAt,
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
