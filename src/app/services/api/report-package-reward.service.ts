import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ReportPackageRewardService {

  constructor(
    private apiSrv: ApiService,
  ) { }

  async getDates(){
    const snapshot = await this.apiSrv.post('/report/package-reward/dates', {});
    return snapshot;
  }

  async getRecordsByDate(date: string, size: number = 10, page: number = 1, filter = {}): Promise<any>{
    try {
      const snapshot = await this.apiSrv.post('/report/package-reward/records', {
        date, size, page, filter
      });

      return {
        ...snapshot,
        filter,
        back: (snapshot.page > 1),
        next: (snapshot.pages > page)
      }
    } catch (err) {
      console.log('Error on PackageRewardService.getRecordsByDate', err);
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
