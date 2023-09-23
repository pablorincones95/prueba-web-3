import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserRankService {

  public rangeList = [
    {
      id: 10,
      label: 'EMBAJADOR CORONA',
      name: 'embajadorCorona'
    },
    {
      id: 9,
      label: 'EMBAJADOR',
      name: 'embajador'
    },
    {
      id: 8,
      label: 'DIAMANTE NEGRO',
      name: 'diamanteNegro'
    },
    {
      id: 7,
      label: 'DIAMANTE AZUL',
      name: 'diamanteAzul'
    },
    {
      id: 6,
      label: 'DIAMANTE',
      name: 'diamante'
    },
    {
      id: 5,
      label: 'ESMERALDA',
      name: 'esmeralda'
    },
    {
      id: 4,
      label: 'PLATINO',
      name: 'platino'
    },
    {
      id: 3,
      label: 'ORO',
      name: 'oro'
    },
    {
      id: 2,
      label: 'PLATA',
      name: 'plata'
    },
    {
      id: 1,
      label: 'BRONCE',
      name: 'bronce'
    },
    {
      id: 0,
      label: 'NA',
      name: 'na'
    }
  ];

  constructor(
    private http: HttpClient
  ) { }

  async getMyRank(
    account: string,
     month = moment().month() + 1, 
     year = moment().format('YYYY')
  ): Promise<any>{
    try {
      const url = `${environment.API_URL}/api/v1/ranks/my-rank`;
      const params = new HttpParams()
        .set('addr', account)
        .set('month', month)
        .set('year', year);

      const snapshot: any = await lastValueFrom(this.http.get(url, {params}));
      return snapshot.results;
      
    } catch (err) {
      console.log('Error on UserRankService.getMyRank', err);
      throw err;
    }
  }

  async getMyHighestRank(account: string): Promise<any>{
    try {
      const url = `${environment.API_URL}/api/v1/ranks/my-last-highest-rank`;
      const params = new HttpParams().set('addr', account);

      const snapshot: any = await lastValueFrom(this.http.get(url, {params}));
      return snapshot.results;
      
    } catch (err) {
      console.log('Error on UserRankService.getMyHighestRank', err);
      throw err;
    }
  }
}
