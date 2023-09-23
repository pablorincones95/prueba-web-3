import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class CustomTranslateService {

  public currentLanguage: string;

  constructor(
    private translateSrv: TranslateService,
  ) {
    this.currentLanguage = this.translateSrv.currentLang;
  }


  /**
   * Traducir texto
   * @param key 
   * @param params 
   * @returns 
   */
  async translate(key: string, params: any = {}): Promise<string> {
    try {
      const result = await this.translateSrv.get(key, params).toPromise();
      return result;
    } catch (err) {
      console.log('Error on CustomTranslateService.translate', err);
      return key;
    }
  }

  /**
   * Leer idioma desde el local storage o utilizar idioma por defecto
   */
  loadLocalLanguage(){
    this.currentLanguage = localStorage.getItem("language") || this.translateSrv.currentLang;
    console.log('currentLanguage', this.currentLanguage);

    if (this.currentLanguage) {
      this.translateSrv.use(this.currentLanguage);
    }
  }

  /**
   * Cambiar idioma
   * @param lang 
   */
  changeLanguage(lang: string) {
    this.translateSrv.use(lang);
  }

}
