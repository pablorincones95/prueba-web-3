import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { handlerObjectResult } from 'src/app/helpers/model.helper';
import { getCollectionName } from 'src/app/helpers/utils';

@Injectable({
  providedIn: 'root'
})
export class CronjobIndicatorsService {

  public collection = getCollectionName('purchasesListingCounter');

  constructor(
    public afs: AngularFirestore,
    private http: HttpClient
  ) { }

  /**
   * Obtener a través del identificador
   * @param docId 
   * @returns 
   */
  getById(docId: string) {
    return this.afs.collection(this.collection).doc(docId).valueChanges()
  }

  async getByIdPromise(docId: string) {
    const snapshot = await this.afs.collection(this.collection).doc(docId).get().toPromise();
    return await handlerObjectResult(snapshot);
  }

  getAll(idField = '_id'){
    return this.afs.collection(this.collection).valueChanges({idField});
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
}
