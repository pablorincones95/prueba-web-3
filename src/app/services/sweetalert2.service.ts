import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { CommonService } from './common.service';
import { CustomTranslateService } from './custom-translate.service';

@Injectable({
  providedIn: 'root',
})
export class Sweetalert2Service {

  public title = environment.projectName;

  constructor(
    private commonSrv: CommonService,
    private customTranslateSrv: CustomTranslateService
  ) { }

  async showError(message: any) {
    return Swal.fire(this.title, message, 'error');
  }

  async showQuestion(message: any) {
    return Swal.fire(this.title, message, 'question');
  }

  async showWarning(message: any) {
    return Swal.fire(this.title, message, 'warning');
  }

  async showSuccess(message: any) {
    return Swal.fire(this.title, message, 'success');
  }

  /**
   *
   * @param message
   * @returns
   */
  async askConfirm(message: string, type = "text") {
    const confirmButtonText = await this.customTranslateSrv.translate('general.yes');
    const cancelButtonText = await this.customTranslateSrv.translate('general.no');
    const { isConfirmed } = await Swal.fire({
      icon: 'info',
      title: this.title,
      [type]: message,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText,
      cancelButtonText,
    });

    return isConfirmed;
  }

  async askUserCodeToRegist() {
    const { value: code } = await Swal.fire({
      title: 'Ingresa tu usuario',
      input: 'text',
      inputPlaceholder: 'Ingresa tu usuario',
      showCancelButton: true,
      inputValidator: (value: any) => {
        const xss = this.commonSrv.removeSpecialCharacters(`${value}`.trim());
        if (xss.length == 0) {
          return 'Es necesario que ingreses un usuario para poder continuar';
        }

        return null;
      },
    });

    if (!code) return null;
    return this.commonSrv.removeSpecialCharacters(`${code}`.trim().toLowerCase());;
  }

  /**
   * Launche alert like toast
   * @param message
   * @param type
   * @returns
   */
  public showToast(message: string, type: any = 'success') {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast: any) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
      customClass: {
        htmlContainer: 'applef sw2FixHtmlContainer',
        icon: 'sw2FixIcon',
      },
    });

    return Toast.fire({ icon: 'success', title: message });
  }

  /**
   * 
   * @param message 
   * @returns 
   */
  async showLoading(message: string = 'Cargando...') {
    return Swal.fire({
      title: message,
      allowOutsideClick: false,
      showConfirmButton: false,
      onBeforeOpen: () => {
        Swal.showLoading();
      }
    });
  }

  /**
   * 
   */
  closeLoading() {
    Swal.close();
  }

}
