import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Web3Service } from './contract/web3.service';
import { CustomTranslateService } from './custom-translate.service';

@Injectable({
  providedIn: 'root',
})
export class Sweetalert2stepsService {

  public title = environment.projectName;

  constructor(
    private web3Srv: Web3Service,
    private customTranslateSrv: CustomTranslateService
  ) {}

  async call(method: string, params: any[] | null) {
    return !params
      ? await this.web3Srv[method]()
      : await this.web3Srv[method](...params);
  }

  /**
   * Mostrar alerta basica
   * @param message
   * @param type
   * @returns
   */
  async showBasicAlert(message: string, type: any = 'success') {
    return await Swal.fire(this.title, message, type);
  }

  /**
   * Mostrar alerta con hash de la transacción
   * @param opts
   * @returns
   */
  async showAlertWithTxHash(opts: any) {
    const seeTransaction = await this.customTranslateSrv.translate('general.seeTransaction')
    const { transactionHash, icon = 'success' } = opts;
    console.log({opts});
    
    return await Swal.fire({
      title: this.title,
      icon,
      html:
      "<a style='color: #e5e61d !important;' href='" +
      environment.chain.blockExplorerUrls +
      'tx/' +
      transactionHash +
      "' target='_blank'>"+seeTransaction+"</a>",
      confirmButtonText: 'OK',
    });
  }

  /**
   * Seguir transacción con token externo
   * @param params
   * @param params.actionMessage
   * @param params.checkBalanceParams
   * @param params.checkBalanceParams.contract
   * @param params.checkBalanceParams.decimals
   * @param params.checkBalanceParams.amount
   * @param params.approvedParams
   * @param params.contractParams
   * @param params.contractParams.method
   * @param params.contractParams.params
   * @returns
   */
  async showStepsWithApproved(params: any) {
    const {
      actionMessage = 'Confirm',
      checkBalanceParams,
      approvedParams,
      contractParams,
    } = params;
    const steps = ['1', '2', '3', '4'];

    /**
     * Construir modal base
     */
    const confirmButtonText = await this.customTranslateSrv.translate('general.yes');
    const cancelButtonText = await this.customTranslateSrv.translate('general.no');
    const Queue = Swal.mixin({
      progressSteps: steps,
      confirmButtonText,
      showCancelButton: true,
      cancelButtonText,
      // optional classes to avoid backdrop blinking between steps
      showClass: { backdrop: 'swal2-noanimation' },
      hideClass: { backdrop: 'swal2-noanimation' },
    });

    /**
     * Confirmar peticion de ejecutar transacción
     */
    const { isConfirmed: ask } = await Queue.fire({
      title: this.title,
      text: actionMessage,
      currentProgressStep: 0,
    });

    // console.log({ask});

    if (!ask) {
      // console.log('transaction cancelled');
      return {
        step: 0,
        data: {
          message: await this.customTranslateSrv.translate('general.transaction-cancelled')
        },
        status: false,
      };
    }

    /**
     * Validar balance del usuario
     */
    const [account] = this.web3Srv.accounts;
    const textCheck = await this.customTranslateSrv.translate('general.check-balance')
    const { value: checkUserBalance } = await Queue.fire({
      title: this.title,
      text: (textCheck),
      currentProgressStep: 1,
      showCancelButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: async () => {
        try {
          Queue.showLoading();
          Queue.enableInput();

          const checkBalance = await this.web3Srv.erc20_checkUserBalance(
            checkBalanceParams.contract,
            checkBalanceParams.amount
          );
          if (checkBalance) {
            return Queue.clickConfirm();
          }

          return Queue.clickCancel();
        } catch (err) {
          console.log(
            'Error on Sweetalert2stepsService@showStepsWithApproved#checkUserBalance',
            { err }
          );
          return Queue.clickCancel();
        }
      },
    });

    if (!checkUserBalance) {
      // console.log('fail user balance');
      return { step: 1, data: { message: await this.customTranslateSrv.translate('general.insufficient-funds') }, status: false };
    }

    /**
     * Aprovar manipulación de fondos del usuario hacia el SC
     */
    const confirmApproval = await this.customTranslateSrv.translate('general.confirmApproval')
    const { value: approved } = await Queue.fire({
      title: this.title,
      text: (confirmApproval),
      currentProgressStep: 2,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCancelButton: false,
      showConfirmButton: false,
      didOpen: async () => {
        Queue.showLoading();

        try {
          const approve = await this.call('erc20_approve', approvedParams);
          console.log({ approve });

          if (!approve) {
            return Queue.clickCancel();
          }

          return Queue.clickConfirm();
        } catch (err) {
          console.log(
            'Error on Sweetalert2stepsService@showStepsWithApproved#approve',
            { err }
          );
          return Queue.clickCancel();
        }
      },
    });

    if (!approved) {
      // console.log('approved cancelled');
      return {
        step: 2,
        data: { message: await this.customTranslateSrv.translate('general.cancelApproved') },
        status: false,
      };
    }

    /**
     * Solicitar firma en la transacción
     */
    let transactionRecord: any;
    const textApprove = await this.customTranslateSrv.translate('general.textApprove')
    const { value: transactionStatus } = await Queue.fire({
      title: this.title,
      text: (textApprove),
      currentProgressStep: 3,
      // backdrop: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCancelButton: false,
      showConfirmButton: false,
      didOpen: async () => {
        try {
          Queue.showLoading();
          Queue.enableInput();
          // Queue.clickConfirm();

          const transaction = await this.call(
            contractParams.method,
            contractParams.params
          );
          transactionRecord = transaction;

          console.log({ transaction });
          return Queue.clickConfirm();
        } catch (err) {
          console.log(
            'Error on Sweetalert2stepsService@showStepsWithApproved#transaction',
            { err }
          );
          return Queue.clickCancel();
        }
      },
    });
    // console.log({transactionRecord, transactionStatus});

    if (!transactionStatus) {
      // console.log('transaction canceled');
      return {
        step: 3,
        data: {  message: await this.customTranslateSrv.translate('general.transaction-cancelled') },
        status: false,
      };
    }

    /**
     * Retornar resultado de la transacción
     */
    return { step: 3, data: transactionRecord, status: true };
  }

  /**
   * Seguir transacción con token nativo
   * @param params
   * @param params.actionMessage
   * @param params.checkBalanceParams
   * @param params.checkBalanceParams.amount
   * @param params.checkBalanceParams.token
   * @param params.checkBalanceParams.token.decimal
   * @param params.contractParams
   * @param params.contractParams.method
   * @param params.contractParams.params
   * @returns
   */
  async showStepsNative(params: any) {
    const {
      actionMessage = 'Confirm',
      checkBalanceParams,
      contractParams,
    } = params;
    const steps = ['1', '2', '3'];
    const confirmButtonText = await this.customTranslateSrv.translate('general.yes');
    const cancelButtonText = await this.customTranslateSrv.translate('general.no');
    const Queue = Swal.mixin({
      progressSteps: steps,
      confirmButtonText,
      showCancelButton: true,
      cancelButtonText,
      // optional classes to avoid backdrop blinking between steps
      showClass: { backdrop: 'swal2-noanimation' },
      hideClass: { backdrop: 'swal2-noanimation' },
    });

    /**
     * Confirmar peticion de ejecutar transacción
     */
    const { isConfirmed: ask } = await Queue.fire({
      title: this.title,
      text: actionMessage,
      currentProgressStep: 0,
    });

    // console.log({ask});

    if (!ask) {
      // console.log('transaction cancelled');
      return {
        step: 0,
        data: {  message: await this.customTranslateSrv.translate('general.transaction-cancelled') },
        status: false,
      };
    }

    /**
     * Validar balance del usuario
     */
    const [account] = this.web3Srv.accounts;
    const textCheck = await this.customTranslateSrv.translate('general.check-balance');
    const { value: checkUserBalance } = await Queue.fire({
      title: this.title,
      text: (textCheck),
      currentProgressStep: 1,
      showCancelButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: async () => {
        try {
          Queue.showLoading();
          Queue.enableInput();

          const checkBalance = await this.web3Srv.checkUserBalanceNative(checkBalanceParams.amount);
          if (checkBalance) {
            return Queue.clickConfirm();
          }

          return Queue.clickCancel();
        } catch (err) {
          console.log(
            'Error on Sweetalert2stepsService@showStepsWithApproved#checkUserBalance',
            { err }
          );
          return Queue.clickCancel();
        }
      },
    });

    if (!checkUserBalance) {
      // console.log('fail user balance');
      return { step: 1, data: { message: await this.customTranslateSrv.translate('general.insufficient-funds') }, status: false };
    }

    /**
     * Solicitar firma en la transacción
     */
    let transactionRecord: any;
    const textSing = await this.customTranslateSrv.translate('general.textSing')
    const { value: transactionStatus } = await Queue.fire({
      title: this.title,
      text: (textSing),
      currentProgressStep: 2,
      // backdrop: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCancelButton: false,
      showConfirmButton: false,
      didOpen: async () => {
        try {
          Queue.showLoading();
          Queue.enableInput();
          // Queue.clickConfirm();

          const transaction = await this.call(
            contractParams.method,
            contractParams.params
          );
          transactionRecord = transaction;

          // console.log({ transaction });
          return Queue.clickConfirm();
        } catch (err) {
          console.log(
            'Error on Sweetalert2stepsService@showStepsNative#transaction',
            { err }
          );
          return Queue.clickCancel();
        }
      },
    });
    // console.log({transactionRecord, transactionStatus});

    if (!transactionStatus) {
      // console.log('transaction canceled');
      return {
        step: 2,
        data: {  message: await this.customTranslateSrv.translate('general.transaction-cancelled') },
        status: false,
      };
    }

    /**
     * Retornar resultado de la transacción
     */
    return { step: 2, data: transactionRecord, status: true };
  }

  /**
   * 
   * @param params 
   * @param params.askMessage
   * @param params.contractParams
   * @param params.contractParams.method
   * @param params.contractParams.params
   * @returns 
   */
  async showStepsGeneral(params: any) {
    const { askMessage, contractParams } = params;
    const steps = ['1', '2'];

    console.log({ contractParams });
    const confirmButtonText = await this.customTranslateSrv.translate('general.yes');
    const cancelButtonText = await this.customTranslateSrv.translate('general.no');
    const Queue = Swal.mixin({
      progressSteps: steps,
      confirmButtonText,
      showCancelButton: true,
      cancelButtonText,
      // optional classes to avoid backdrop blinking between steps
      showClass: { backdrop: 'swal2-noanimation' },
      hideClass: { backdrop: 'swal2-noanimation' },
    });

    /**
     * Confirmar peticion de ejecutar transacción
     */
    const { isConfirmed: ask } = await Queue.fire({
      title: this.title,
      text: askMessage,
      currentProgressStep: 0,
    });

    // console.log({ask});

    if (!ask) {
      // console.log('transaction cancelled');
      return {
        step: 0,
        data: {  message: await this.customTranslateSrv.translate('general.transaction-cancelled') },
        status: false,
      };
    }

    /**
     * Solicitar firma en la transacción
     */
    let transactionRecord: any;
    const textApprove = await this.customTranslateSrv.translate('general.textApprove')
    const { value: transactionStatus } = await Queue.fire({
      title: this.title,
      text: (textApprove),
      currentProgressStep: 1,
      // backdrop: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCancelButton: false,
      showConfirmButton: false,
      didOpen: async () => {
        try {
          Queue.showLoading();
          Queue.enableInput();
          // Queue.clickConfirm();

          const transaction = await this.call(
            contractParams.method,
            contractParams.params
          );
          transactionRecord = transaction;

          // console.log({ transaction });
          return Queue.clickConfirm();
        } catch (err) {
          console.log(
            'Error on Sweetalert2stepsService@showStepsGeneral#transaction',
            { err }
          );
          return Queue.clickCancel();
        }
      },
    });
    // console.log({transactionRecord, transactionStatus});

    if (!transactionStatus) {
      // console.log('transaction canceled');
      return {
        step: 1,
        data: {  message: await this.customTranslateSrv.translate('general.transaction-cancelled') },
        status: false,
      };
    }

    /**
     * Retornar resultado de la transacción
     */
    return { step: 1, data: transactionRecord, status: true };
  }


  public showToast(message: string, type: any = 'success'){
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast: any) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      },
      customClass: {
        htmlContainer: 'applef sw2FixHtmlContainer',
        icon: 'sw2FixIcon',
      }
    });
    
    return Toast.fire({ icon: 'success', title: message })
  }
}
