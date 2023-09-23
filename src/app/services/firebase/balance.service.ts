import { Injectable } from '@angular/core';
import { AngularFirestore, Query } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { handlerObjectResult } from 'src/app/helpers/model.helper';
import { getCollectionName } from 'src/app/helpers/utils';

@Injectable({
  providedIn: 'root'
})
export class BalanceService {

  public collection = getCollectionName('balance2');

  constructor(
    public afs: AngularFirestore
  ) { }

  /**
   * Registrar
   * @param data 
   * @returns 
   */
  async store(data: any) {
    const snapshot = await this.afs.collection(this.collection).add(data);
    return snapshot.id;
  }


  /**
   * Actualizar
   * @param docId 
   * @param data 
   * @returns 
   */
  async update(docId: string, data: any) {
    return await this.afs.collection(this.collection).doc(docId).update(data);
  }


  /**
   * Obtener a través del identificador
   * @param docId 
   * @returns 
   */
  getById(docId: string) {
    return this.afs.collection(this.collection).doc(docId).valueChanges()
  }


  /**
   * 
   * @param docId 
   * @returns 
   */
  async getByIdPromise(docId: string) {
    // console.log('docId', docId);
    const snapshot = await this.afs.collection(this.collection).doc(docId).get().toPromise();
    return await handlerObjectResult(snapshot);
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