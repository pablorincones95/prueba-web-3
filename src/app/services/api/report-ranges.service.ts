import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ReportRangesService {

  constructor(
    private apiSrv: ApiService,
  ) { }

  async getDates(){
    const snapshot = await this.apiSrv.post('/report/ranges/dates', {});
    return snapshot.dates;
  }

  async getRecordsByDate(
    year: string | number,
    month: string | number, 
    size: number = 10, 
    page: number = 1, 
    filter = {}
  ): Promise<any>{
    try {
      const snapshot = await this.apiSrv.post('/report/ranges/records', {
        year, month, size, page, filter
      });

      return {
        ...snapshot,
        filter,
        back: (snapshot.page > 1),
        next: (snapshot.pages > page)
      }
    } catch (err) {
      console.log('Error on ReportRangesService.getRecordsByDate', err);
      return {
        year: year,
        month: month,
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
