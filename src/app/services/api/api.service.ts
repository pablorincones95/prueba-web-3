import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { generateServerHashSHA256 } from 'src/app/helpers/hashGeneratorSHA256';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public apiURL = `${environment.API_URL}/api/v1`;

  constructor(
    private http: HttpClient
  ) { }


  async post(url: string, data: any){
    try {

      const hash = await generateServerHashSHA256(JSON.stringify(data));
      const apiLink = `${this.apiURL}${url}`;
      // console.log('apiLink', apiLink);
      
      const snapshot: any = await lastValueFrom(this.http.post(apiLink, {...data, hash}));
      return snapshot.results;
      
    } catch (err) {
      console.log('Error on ApiService.post', err);
      throw err;
    }
  }
}
