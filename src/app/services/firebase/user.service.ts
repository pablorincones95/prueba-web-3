import { Injectable } from '@angular/core';
import { AngularFirestore, Query } from '@angular/fire/firestore';
import { lastValueFrom, Observable } from 'rxjs';
import { handlerArrayResult, handlerObjectResult } from 'src/app/helpers/model.helper';
import { getCollectionName } from 'src/app/helpers/utils';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public collection = getCollectionName('users_blockchain2');

  constructor(
    public afs: AngularFirestore
  ) { }

  /**
   * 
   * @returns 
   */

  getUserlocal() {
    let user: any = localStorage.getItem('user');
    return JSON.parse(user);
  }

  setUserlocal(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }

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

  async getByReferredCodePromise(code: string) {
    // console.log('code', code);
    const snapshot = await this.afs.collection(this.collection
      ,(ref) => ref.where('code', '==', code).limit(1))
    .get().toPromise();
    const result = await handlerArrayResult(snapshot);
    return result.pop();
  }


  /**
   * Obtener código de quien refiere a traves de su wallet
   * @param addr 
   * @returns 
   */
  async getReferredByWalletPromise(addr: string) {
    return await this.getByIdPromise(addr);
  }


  /**
   * Obtener a través de la dirección  de correo
   * @param email 
   * @returns 
   */
  async getByEmail(email: string) {
    const snapshot = await lastValueFrom(this.afs.collection(this.collection,
      (ref) => ref.where('email', '==', email).limit(1)).get());
    const result = await handlerArrayResult(snapshot);
    return (result.length > 0) ? result[0] : null;
  }

  /**
   * Obtener listado completo
   * @returns 
   */
  async getAll() {
    const snapshot = await this.afs.collection(this.collection).ref.get();
    return await handlerArrayResult(snapshot);
  }

  async getLastUserDirectReferralsByAddr(addr: string, opts: any = {}){
    
      const {
        page = 1,
        limit = null,
        limitToLast = null,
        startAt = null,
        endAt = null,
        startAfter = null,
        endBefore = null
      } = opts;

      try {
        const snapshot = await this.afs.collection(
          this.collection
          ,(ref) => {
  
              let query: Query = ref.where('referredByAddr', '==', addr).orderBy('createdAt', 'desc');
              
              if(startAt){ query = query.startAt(startAt); }
              if(endAt){ query = query.endAt(endAt); }
              if(limit){ query = query.limit(limit); }
              if(limitToLast){ query = query.limitToLast(limitToLast); }
              if(startAfter){ query = query.startAfter(startAfter); }
              if(endBefore){ query = query.endBefore(endBefore);}
              
            return query; 
          })
        .get().toPromise();
        
        const data = await handlerArrayResult(snapshot);

        return {
          page,
          total: data.length,
          next: (data.length == limit || data.length == limitToLast),
          back: (page > 1),
          list: data,
          endAt: (snapshot?.empty) ? null : snapshot?.docs[snapshot?.docs.length - 1],
          startAt: (snapshot?.empty) ? null : snapshot?.docs[0],
          limit,
          nose: snapshot?.docs.length,
        }
      } catch (error) {
        return console.log(error)
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