import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore, Query } from '@angular/fire/firestore';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { lastValueFrom, Observable } from 'rxjs';
import { generateServerHashSHA256 } from 'src/app/helpers/hashGeneratorSHA256';
import { handlerObjectResult } from 'src/app/helpers/model.helper';
import { getCollectionName } from 'src/app/helpers/utils';
import { PackageRewardConfig } from 'src/app/interfaces';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PackageRewardConfigService {

  public collection = getCollectionName('package_revenew_config2');

  constructor(
    public afs: AngularFirestore,
    private http: HttpClient
  ) { }

  buildDoc(params: PackageRewardConfig): PackageRewardConfig{
    return {
      date: params.date,
      yieldFarmingPercentage: params.yieldFarmingPercentage,
      flexiblePercentage: params.flexiblePercentage,
      createdAt: params.createdAt,
      executed: params.executed || false,
      executedAt: params.executedAt || null,
    };
  }

  /**
   * Registrar
   * @param data 
   * @returns 
   */
  async store(data: PackageRewardConfig) {
    try {

      const hash = await generateServerHashSHA256(JSON.stringify(data));
      const url = `${environment.API_URL}/api/v1/package-reward/config/store`;

      await lastValueFrom(this.http.post(url, {...data, hash}));
      await this.afs.collection(this.collection).doc(data.date).set(data);
      return;
      
    } catch (err) {
      console.log('Error on PackageRewardConfigService.store', err);
      throw err;
    }
  }

  async remove(data: PackageRewardConfig) {
    try {

      const hash = await generateServerHashSHA256(JSON.stringify({date: data.date}));
      const url = `${environment.API_URL}/api/v1/package-reward/config/remove`;

      await lastValueFrom(this.http.post(url, {date: data.date, hash}));
      await this.afs.collection(this.collection).doc(data.date).delete();
      return;
      
    } catch (err) {
      console.log('Error on PackageRewardConfigService.store', err);
      throw err;
    }
  }


  /**
   * Actualizar
   * @param docId 
   * @param data 
   * @returns 
   */
  async update(docId: string, data: PackageRewardConfig) {
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

  async getListPaginated(size: number = 10, page: number = 1): Promise<any>{
    try {
      const data = {size, page};
      const hash = await generateServerHashSHA256(JSON.stringify(data));
      const url = `${environment.API_URL}/api/v1/package-reward/config/list`;

      const snapshot: any = await lastValueFrom(this.http.post(url, {...data, hash}));

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
      console.log('Error on PackageRewardConfig.getListPaginated', err);
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

export function checkPackageRewardConfigIsStored(service: PackageRewardConfigService): AsyncValidatorFn{
  return async (control: AbstractControl): Promise<ValidationErrors | null> => {
    const configDoc = await service.getByIdPromise(control.value);
    return (!configDoc) ? null : { configStored: true };
  }
}
