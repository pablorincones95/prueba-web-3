import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as moment from 'moment';
import { lastValueFrom } from 'rxjs';
import { handlerObjectResult } from 'src/app/helpers/model.helper';
import { getCollectionName } from 'src/app/helpers/utils';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BinaryTreeService {

  public collection = getCollectionName('users_binary_tree2');

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

  /**
   * Obtener segmento de arbol binario del usuario a través de la wallet
   * @param addr                    Dirección de billetera
   * @param maxLevel                Cantidad máxima de niveles a cargar
   * @returns 
   */
  async getUserBinaryTree(addr: string, maxLevel: number){
    try {
      const url = `${environment.API_URL}/api/v1/binary-tree/user-tree`;
      const data = {addr, maxLevel};
      // console.log('data', data);

      const snapshot: any = await lastValueFrom(this.http.post(url, data));
      return snapshot.results;
      
    } catch (err) {
      console.log('Error on PurchasesService.getTopSalesApi', err);
      throw err;
    }
  }


  /**
   * Obtener listado de referidos directos de un usuario con paginación
   * a través de la wallet
   * @param addr                    Dirección de billetera
   * @param size                    Tamaño del listado
   * @param page                    Identificador de la página
   * @param code                    Código a filtrar
   * @returns 
   */
  async getUserBinaryTreeDirects(addr: string, size: number, page: number, code: string | null = null){
    try {
      const url = `${environment.API_URL}/api/v1/binary-tree/my-directs`;
      const data = {
        addr,
        size,
        page,
        code
      };
      // console.log('data', data);

      const snapshot: any = await lastValueFrom(this.http.post(url, data));
      const maxPages = Math.ceil(snapshot.results.total / size);

      return {
        page: page,
        total: snapshot.results.total,
        rows: snapshot.results.rows
        .map((row: any) => ({...row, createdAt: moment(row.createdAt).format('DD-MM-YYYY')}) ),
        size: size,
        back: (page > 1),
        next: (maxPages > page)
      }
      
    } catch (err) {
      console.log('Error on BinaryTreeService.getUserBinaryTreeDirects', err);
      throw err;
    }
  }

  /**
   * Obtener listado de usuarios pertenecientes a la red de un usuario
   * a través de la wallet
   * @param addr                    Dirección de billetera
   * @param size                    Tamaño del listado
   * @param page                    Identificador de la página
   * @param code                    Código a filtrar
   * @returns 
   */
  async getUserBinaryTreeNetwork(addr: string, size: number, page: number, code: string | null = null){
    try {
      const url = `${environment.API_URL}/api/v1/binary-tree/my-network`;
      const data = {
        addr,
        size,
        page,
        code
      };
      // console.log('data', data);

      const snapshot: any = await lastValueFrom(this.http.post(url, data));
      const maxPages = Math.ceil(snapshot.results.total / size);

      return {
        page: page,
        total: snapshot.results.total,
        rows: snapshot.results.rows
        .map((row: any) => ({...row, createdAt: moment(row.createdAt).format('DD-MM-YYYY')}) ),
        size: size,
        back: (page > 1),
        next: (maxPages > page)
      }
      
    } catch (err) {
      console.log('Error on BinaryTreeService.getUserBinaryTreeDirects', err);
      throw err;
    }
  }

  async getUserTotalDirects(addr: string){
    try {
      const url = `${environment.API_URL}/api/v1/binary-tree/my-directs-total`;
      const snapshot: any = await lastValueFrom(this.http.post(url, {addr}));
      return snapshot.results.total;
      
    } catch (err) {
      console.log('Error on BinaryTreeService.getUserTotalDirects', err);
      throw err;
    }
  }

  async getUserTotalNetwork(addr: string){
    try {
      const url = `${environment.API_URL}/api/v1/binary-tree/my-network-total`;
      const snapshot: any = await lastValueFrom(this.http.post(url, {addr}));
      return snapshot.results.total;
      
    } catch (err) {
      console.log('Error on BinaryTreeService.getUserTotalNetwork', err);
      throw err;
    }
  }

  async getUserTotalNetworkPackageStatus(addr: string){
    try {
      const url = `${environment.API_URL}/api/v1/binary-tree/my-network-total-package-status`;
      const snapshot: any = await lastValueFrom(this.http.post(url, {addr}));
      return snapshot.results;
      
    } catch (err) {
      console.log('Error on BinaryTreeService.getUserTotalNetworkPackageStatus', err);
      throw err;
    }
  }

  async getUserCurrentVolumen(addr: string){
    try {
      const url = `${environment.API_URL}/api/v1/binary-tree/my-current-volumen`;
      const snapshot: any = await lastValueFrom(this.http.post(url, {addr}));
      return snapshot.results;
      
    } catch (err) {
      console.log('Error on BinaryTreeService.getUserCurrentVolumen', err);
      throw err;
    }
  }

  async getUserCurrentWeeklyCut(addr: string){
    try {
      const url = `${environment.API_URL}/api/v1/binary-tree/my-current-weekly-cut`;
      const snapshot: any = await lastValueFrom(this.http.post(url, {addr}));
      return snapshot.results;
      
    } catch (err) {
      console.log('Error on BinaryTreeService.getUserCurrentVolumen', err);
      throw err;
    }
  }
}
