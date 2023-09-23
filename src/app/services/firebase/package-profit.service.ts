import { Injectable } from '@angular/core';
import { AngularFirestore, Query } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { getCollectionName } from 'src/app/helpers/utils';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class PackageProfitService {

  public collection = getCollectionName('package_profit');

  constructor(
    public afs: AngularFirestore,
    private apiSrv: ApiService,
  ) { }

  getById(docId: string) {
    return this.afs.collection(this.collection).doc(docId).valueChanges()
  }

  /**
   * Obtener monto del reward disponible por reclamar
   * @param addr 
   * @returns 
   */
  async getUserRewardAvailableAmount(addr: string){
    try {
      const {total = 0} = await this.apiSrv.post('/package-reward/user/available', { addr });
      return total;
      
    } catch (err) {
      console.log('Error on PackageProfitService.getUserRewardAvailableAmount', err);
      return 0;
    }
  }

  async getUserDates(addr: string){
    const snapshot = await this.apiSrv.post('/package-reward/user/dates', {filter: {field: "addr", value: addr}});
    return snapshot;
  }

  async getAllUserRecordsByWallet(addr: string, size: number = 10, page: number = 1, order = 'ASC'){
    const snapshot = await this.apiSrv.post('/package-reward/user/all-records', {
      filter: {field: "addr", value: addr},
      size,
      page,
      order
    });
    return snapshot;
  }

  /**
   * Obtener listado dinamico
   * @param where 
   * @param where.field 
   * @param where.condition
   * @param where.value
   * @param opts 
   * @param opts.idField
   * @param opts.orderBy
   * @param opts.orderBy.field
   * @param opts.orderBy.order
   * @param opts.startAt
   * @param opts.endAt
   * @param opts.limit
   * 
   * @returns 
   */
  getDynamic(where: any[] = [], opts: any = {}): Observable<any[]> {
    const {
      idField = "_id",
      startAt = null,
      endAt = null,
      orderBy = [],
      limit = null
    } = opts;

    return this.afs.collection(this.collection,
      (ref) => {
        let query: Query = ref;
        for (const row of where) { query = query.where(row.field, row.condition, row.value); }

        for (const order of orderBy) { query = query.orderBy(order.field, order.order); }

        if (startAt) { query = query.startAt(startAt); }

        if (endAt) { query = query.endAt(endAt); }

        if (limit) { query = query.limit(limit); }

        return query;
      }
    ).valueChanges({ idField });
  }
}