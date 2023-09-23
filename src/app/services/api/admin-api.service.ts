import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AdminApiService {

  constructor(
    private apiSrv: ApiService,
  ) { }

  async findUser(field: string, value: string){
    const snapshot = await this.apiSrv.post('/admin/find-user', {field, value});
    return snapshot;
  }

  async updateUserCreationType(field: string, value: string, newValue: string){
    const snapshot = await this.apiSrv.post('/admin/update-user-creation-type', {field, value, newValue});
    return snapshot;
  }
}
