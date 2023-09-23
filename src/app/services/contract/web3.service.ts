import { Inject, Injectable, OnInit } from '@angular/core';
import { WEB3 } from '../../core/web3';
import { from, map, Observable, Subject, tap } from 'rxjs';
// import Web3Modal from "web3modal";
// import WalletConnectProvider from "@walletconnect/web3-provider";

import { provider } from 'web3-core';
import { AbiService } from 'src/app/services/contract/abi.service';
import { environment } from 'src/environments/environment';
import { chunkArray, customArrayNumber, fromWei, getCurrentDateTimeBlock, toGwei, toWei } from 'src/app/helpers/utils';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import BigNumber from 'bignumber.js';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';


/// @dev walletconnect
import { EthereumProvider } from "@walletconnect/ethereum-provider";
import Web3 from 'web3';
import { BscGasService } from '../bsc-gas.service';
declare let window: any;
const METHOD_CONNECT = '__eth_connect';
const WALLET_CONNECT = '__eth_wallet';

@Injectable({
  providedIn: 'root'
})
export class Web3Service implements OnInit {

  /** Instancia para obtener wallets conectadas */
  public accountStatusSource = new Subject<any>();
  accountStatus$ = this.accountStatusSource.asObservable();

  /** Instancia del provider */
  public provider: any;

  /** Tipo de provider utilizado para conectar */
  private providerType: any;

  /** Arreglo de wallets conectadas */
  public accounts: any | undefined;

  /** web3 Instance */
  private web3js: any;

  /** web3Modal Instance */
  private web3Modal: any

  /** ERC20 ABI */
  public erc20ABI = '/assets/abi/erc20.json';

  /** ERC721 ABI */
  public erc721ABI = '/assets/abi/erc721.json';

  /** Chainlink Oracle ABI */
  public oracleABI = '/assets/abi/OracleABI.json';

  /** ERC721 ABI */
  public mainRedABI = '/assets/abi/MainRed.json';


  /** Contrato provisional de retiro ABI */
  public ncwABI = '/assets/abi/NCW.json';

  /** Fee Interno por transacción */
  public internalTxFee = 0.5;


  ethereumProvider: any;

  constructor(
    @Inject(WEB3) private web3: Web3,
    public abiService: AbiService,
    private bscGasSrv: BscGasService
  ) {

  }


  async ngOnInit(): Promise<void> {
    if (window.ethereum) {
      this.web3 = new Web3(window.ethereum);
      // Request account access if needed
      window.ethereum.enable().catch(console.error);
    } else if (window.web3) {
      // Use Mist/MetaMask's provider
      this.web3 = new Web3(window.web3.currentProvider);
    } else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }

  async launchAskConnectionType() {
    const swalPromise = new Promise((resolve, reject) => {
      Swal.fire({
        title: 'Connect With',
        showCancelButton: false,
        showConfirmButton: false,
        focusConfirm: false,
        html:
          '<div class="d-grid gap-2">' +
          '<button id="metamask-button" class="btn btn-primary swCT">' +
          '<img src="assets/img/metamask_logo.png" alt="Metamask" style="max-height: 16px;">' +
          '</button>' +
          '<button id="walletconnect-button" class="btn btn-primary swCT">' +
          '<img src="assets/img/walletconnect_logo.png" alt="WalletConnect" style="max-height: 16px;">' +
          '</button>' +
          '<button id="cancel-button" class="btn btn-danger swCT"><i class="bi bi-x-lg"></i> Cancel</button>' +
          '</div>',
        didOpen: () => {
          document.getElementById('metamask-button').addEventListener('click', () => {
            Swal.close();
            resolve('metamask');
          });

          document.getElementById('walletconnect-button').addEventListener('click', () => {
            Swal.close();
            resolve('walletconnect');
          });

          document.getElementById('cancel-button').addEventListener('click', () => {
            Swal.close();
            resolve('cancel');
          });
        },
      });
    });

    const selectedOption = await swalPromise;
    // console.log('selectedOption', selectedOption);
    switch (selectedOption) {
      case 'metamask': return this.connectAccountMetaMask();
      case 'walletconnect': return this.connectAccountWalletConnect();
      default:
        // console.log('cancel');
        return
    }
  }


  /**
   * TODO: funcion temapopral para conectar con walletconnect 
   * hasta que solucione el problema de la sesion de walletconnect
   * @returns 
   */
  restartingConnection() {
    const walletConnect = localStorage.getItem(WALLET_CONNECT) || null;
    console.log('restartingConnection....');
    console.log('this.web3js', this.web3js);
    console.log('this.ethereumProvider', this.ethereumProvider);


    if (!this.web3js || !this.ethereumProvider || !walletConnect) {
      console.error('no hay conexion');
      localStorage.setItem(METHOD_CONNECT, "0");

      /// @DEV des
      setTimeout(() => {
        this.logout();
      }, 300);

      return
    }


    console.log('si hay conexion', walletConnect);

    setTimeout(() => {
      this.accounts = [walletConnect];

      /// 
      this.accountStatusSource.next([walletConnect]);
    }, 300);

  }

  /**
   * @dev conectar con metamask
   * @returns 
   */
  connectAccountMetaMask() {
    console.log('connectAccountMetaMask....');
    return new Promise(async (resolve, reject) => {
      try {


        /// @dev cargar provider in web3
        this.web3js = new Web3(window.ethereum);

        /// @dev check if metamask is installed
        await window.ethereum.request({ method: 'eth_requestAccounts' });



        /// @dev get accounts
        this.accounts = await this.web3js.eth.getAccounts();
        console.warn('this.accounts', this.accounts);


        /// @dev cuando se conecta con metamask send accounts
        this.accountStatusSource.next(this.accounts);

        /// @dev check network
        await this.checkNetworkLocal();

        /// @dev initialize events
        this.initializeEventsMetamask();


        /// @dev guardar metodo de conexion
        localStorage.setItem(WALLET_CONNECT, this.accounts[0]);

        /// @dev guardar metodo de conexion
        localStorage.setItem(METHOD_CONNECT, "2");


        resolve(this.accounts);
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
  }



  /**
   * TODO: nueva version de walletconnect
   */
  async connectAccountWalletConnect() {
    console.log('connectAccount  wallet conect....');
    return new Promise(async (resolve, reject) => {
      try {

        // @dev inicializar provider
        this.ethereumProvider = await this.ethereumProviderInit()

        // @sesion de wallet conectada
        console.log('this.ethereumProvider', this.ethereumProvider.signer);


        // @dev enable provider
        await this.ethereumProvider.enable();


        /// @dev cargar provider in web3
        this.web3js = new Web3(this.ethereumProvider);


        this.accounts = await this.web3js.eth.getAccounts();
        console.warn('this.accounts', this.accounts);


        console.log('this.accounts', this.accounts);
        this.accountStatusSource.next(this.accounts);



        this.initializeEventsWalletconnect();

        /// @dev guardar metodo de conexion
        localStorage.setItem(METHOD_CONNECT, "1");

        /// @dev 
        localStorage.setItem(WALLET_CONNECT, this.accounts[0]);

        resolve(this.accounts);
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
  }



  /**
   * @dev check network
   */
  private async initializeEventsWalletconnect() {


    this.ethereumProvider.on("connect", async () => {
      console.log('connect');
    });

    // @dev cuando se desconecta
    this.ethereumProvider.on("disconnect", async () => {
      console.log('disconnect');
      window.location.reload();
    });


    /// @dev cuando se actualiza la sesion
    this.ethereumProvider.on("session_update", async (error: any, payload: any) => {
      console.log('session_update');
    });

    /// @dev cuando se actualiza la sesion
    this.ethereumProvider.on("accountsChanged", async (accounts: any) => {
      console.log('accountsChanged');
      // window.location.reload();
    });


    /// @dev cuando se actualiza la sesion
    this.ethereumProvider.on("chainChanged", async (chainId: any) => {
      console.log('chainChanged');
    });

  }

  /**
 * @dev check network
 */
  private initializeEventsMetamask() {
    window.ethereum.on('accountsChanged', (accounts: string[]) => {
      console.log('Accounts changed:', accounts);
      // Implement logic for handling account changes
      window.location.reload();
    });

    window.ethereum.on('chainChanged', (chainId: string) => {
      console.log('Chain changed:', chainId);
      // Implement logic for handling chain changes
      window.location.reload();
    });

    window.ethereum.on('connect', (connectInfo: { chainId: string }) => {
      console.log('Connected:', connectInfo.chainId);
      // Implement logic for handling connection
      window.location.reload();
    });

    window.ethereum.on('disconnect', (error: { code: number, message: string }) => {
      console.log('Disconnected:', error.message);
      // Implement logic for handling disconnection
      window.location.reload();
    });
  }



  /**
   * 
   * @returns 
   */
  async ethereumProviderInit() {
    const result = await EthereumProvider.init({
      projectId: environment.chain.walletConnectID,
      showQrModal: true,
      qrModalOptions: { themeMode: "dark" },
      chains: [environment.chain.chainId],
      rpcMap: { [environment.chain.chainId]: environment.chain.rpc },
      methods: ["eth_sendTransaction", "personal_sign"],
      events: ["chainChanged", "accountsChanged"],
      metadata: {
        name: "Gemyn Dapp",
        description: "",
        url: "",
        icons: [""],
      },
    });

    return result;
  }


  /**
   * 
   * @param reload 
   */
  async logout(reload = true) {
    const method = localStorage.getItem(METHOD_CONNECT);
    if (method == "1") {
      await this.ethereumProvider.disconnect();
    }

    window.localStorage.clear();
    this.accounts = null
    this.provider = null
    this.accountStatusSource.next(null);

    if (reload) { window.location.reload(); }
  }









  /**
   * TODO: esta version esta en desuso, se debe usar la de abajo
   * @returns 
   */
  // async connectAccountOLD() {
  //   this.provider = await this.web3Modal.connect(); // set provider

  //   if (this.provider) {
  //     this.web3js = new Web3(this.provider);
  //   } // create web3 instance

  //   /** Capturar tipo de provider */
  //   const providerTypeToParse = window.localStorage.getItem('WEB3_CONNECT_CACHED_PROVIDER');
  //   this.providerType = `${providerTypeToParse}`.replace(/"/g, '');

  //   /** Validar si el provider es WalletConnect */
  //   const wcVerify = await this.checkWalletConnectProviderConnection();
  //   if (!wcVerify) return;

  //   this.accounts = await this.web3js.eth.getAccounts();
  //   this.accountStatusSource.next(this.accounts);

  //   this.checkNetworkLocal();

  //   this.eventsAll();

  //   return this.accounts;
  // }


  /**
   * TODO: se debe actuializar a esta version a la nueva version de walletconnect
   */  async checkWalletConnectProviderConnection() {

    /** Validar si corresponde al provider */
    if (this.providerType !== 'walletconnect') return true;

    /** Validar si es la red correcta */
    const providerChainId = await this.web3js.eth.net.getId();
    if (providerChainId == environment.chain.chainId) return true;

    await this.web3Modal.clearCachedProvider();
    await this.provider.close();
    this.provider = null;

    Swal.fire({
      title: environment.projectName,
      icon: 'error',
      text: `Network error, please connect to ${environment.chain.chainName}`,
    });
    return false;
  }


  /**
   * TODO: se debe actuializar a esta version a la nueva version de walletconnect
   */
  async checkNetworkLocal() {
    const chainId = await this.web3js.eth.net.getId();
    if (chainId != environment.chain.chainId) {
      const modalChangeChain = await Swal.fire({
        title: environment.projectName,
        icon: 'warning',
        text: `Please switch to ${environment.chain.chainName}`,
        allowOutsideClick: false,
        allowEnterKey: false,
        allowEscapeKey: false,
        showCancelButton: false,
        showConfirmButton: true,
        confirmButtonText: 'Change',
        showLoaderOnConfirm: true,
        preConfirm: async () => {
          try {
            const runChange = await this.changeChainIdOrAdd();
          } catch (err: any) {
            // console.log('modal error', err);
            Swal.showValidationMessage(`${err.message}`);
          }
        },
      });

      // console.log({modalChangeChain});
    }
  }

  /**
   *  TODO: se debe actuializar a esta version a la nueva version de walletconnect
   * @returns 
   */
  async changeChainIdOrAdd() {
    try {
      const tryChange = await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: environment.chain.chainIdMetamask }],
      });

      // console.log({tryChange});

      return tryChange
    } catch (err: any) {

      /** Si no tiene la red registrada */
      if (err.code === 4902) { return await this.addChainId(); }

      /** Si tiene trasacciones pendientes por ejecutar */
      if (err.code === 4001) {
        err.message = 'Please, confirm the request for change of network';
      }

      /** Si tiene trasacciones pendientes por ejecutar */
      if (err.code === -32002) {
        err.message = 'You have pending requests on your wallet. Please, check on your wallet before continuing';
      }

      throw err;
    }
  }

  /**
   * TODO: se debe actuializar a esta version a la nueva version de walletconnect
   * @returns 
   */
  async addChainId() {
    try {
      const wasAdded = await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: environment.chain.chainIdMetamask,
            rpcUrls: environment.chain.rpcUrls,
            chainName: environment.chain.chainName,
            nativeCurrency: environment.chain.nativeCurrency.symbol,
            blockExplorerUrls: environment.chain.blockExplorerUrls,
          }
        ],
      });

      // console.log({wasAdded});
      return wasAdded;
    } catch (err: any) {
      alert("Please connect to Binance Smart Chain");
    }
  }

  /**
   * Validar estado de la red
   */
  async checkNetwork() {
    const networkId = await this.web3js.eth.net.getId();
    console.log("networkId", networkId);
    if (environment.chain.chainId != networkId) {
      alert("Please connect to Binance Smart Chain");
      return false;
    }

    return true;
  }


  /**
   * TODO: funcion descontinuada
   * @param reload 
   */
  // eventsAll() {
  //   // Subscribe to accounts change
  //   this.provider.on("accountsChanged", (accounts: string[]) => {
  //     // console.warn("accountsChanged", accounts);
  //     this.accountStatusSource.next(accounts)
  //     window.location.reload();
  //   });

  //   // Subscribe to chainId change
  //   this.provider.on("chainChanged", (chainId: number) => {
  //     // console.log("chainChanged", chainId);
  //     window.location.reload();
  //   });

  //   // Subscribe to provider connection
  //   this.provider.on("connect", (info: { chainId: number }) => {
  //   });

  //   // Subscribe to provider disconnection
  //   this.provider.on("disconnect", (error: { code: number; message: string }) => {
  //     // console.log("disconnect", error);
  //     this.logout(true);
  //   });
  // }



  /** ===============================================================
   *                      Native Methods
   ================================================================ */

  /**
   * Obtiene el balance de token nativo
   * @param account
   * @returns
   */
  async balanceOfNative(account: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.web3js.eth.getBalance(account, (err: any, res: any) => {
        if (err) {
          console.log(err)
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  }

  /**
   * Válida balance de usuario en token nativo
   * @param amount
   * @returns
   */
  async checkUserBalanceNative(amount: string) {
    const balance = await this.balanceOfNative(this.accounts[0]);
    const balanceParse = new BigNumber(`${balance}`);
    return balanceParse.isGreaterThanOrEqualTo(amount);
  }


  /* =======================================================
   *                     ERC20 Methods
   * ===================================================== */

  async erc20_approve(erc20Contract: string, contractAddress: string, amount: string) {
    const [account] = this.accounts;
    return await this.calculateAndCallCustomABI({
      contractAddress: erc20Contract,
      method: 'approve',
      params: [contractAddress, amount],
      callType: 'send',
      optionals: { from: account },
      urlABI: this.erc20ABI
    });
  }

  /**
   * Consultar balance de token ERC20
   * @param contractAddress               Dirección del contrato
   * @param account                       Dirección de la wallet
   * @returns 
   */
  async erc20_balanceOf(contractAddress: string, account: string) {
    return await this.calculateAndCallCustomABI({
      contractAddress: contractAddress,
      method: 'balanceOf',
      params: [account],
      callType: 'call',
      urlABI: this.erc20ABI
    });
  }

  /**
   * Verificar balance de usuario
   * @param contractAddress               Dirección del contrato
   * @param amount                        Cantidad a transferir en WEI
   * @returns 
   */
  async erc20_checkUserBalance(contractAddress: string, amount: any) {
    const [account] = this.accounts;
    const balance = await this.erc20_balanceOf(contractAddress, account);
    const balanceParse = new BigNumber(balance);
    return balanceParse.isGreaterThanOrEqualTo(amount);
  }


  /** ===============================================================
   *                MAINRED ORACLE Methods
   ================================================================ */

  async mainred_oracle_parseUSDtoToken(amount: any, token: string, isNative: boolean) {
    return this.calculateAndCallCustomABI({
      contractAddress: environment.contractAddress,
      method: 'parseUSDtoToken',
      params: [amount, token, isNative],
      callType: 'call',
      urlABI: this.mainRedABI
    });
  }

  /** ===============================================================
  *                MAINRED Admin Methods
  ================================================================ */

  async mainred_admin_addAdmin(wallet: string) {
    return this.calculateAndCallCustomABI({
      contractAddress: environment.contractAddress,
      method: 'addAdmin',
      params: [wallet],
      callType: 'send',
      urlABI: this.mainRedABI
    });
  }

  async mainred_admin_addUser(wallet: string) {
    return this.calculateAndCallCustomABI({
      contractAddress: environment.contractAddress,
      method: 'addUser',
      params: [wallet],
      callType: 'send',
      urlABI: this.mainRedABI
    });
  }

  async mainred_admin_withdrawOwner(type: number, amount: string, addressToken: string) {
    return this.calculateAndCallCustomABI({
      contractAddress: environment.contractAddress,
      method: 'withdrawOwner',
      params: [type, amount, addressToken],
      callType: 'send',
      urlABI: this.mainRedABI
    });
  }

  async mainred_admin_adddUserReAsAdmin(code: string, wallet: string, hostSide: string, referredBy: string) {
    return this.calculateAndCallCustomABI({
      contractAddress: environment.contractAddress,
      method: 'addUserRedAsAdmin',
      params: [code, wallet, hostSide, referredBy],
      callType: 'send',
      urlABI: this.mainRedABI
    });
  }

  async mainred_admin_setDistPercentage(type: number, newValue: string) {
    return this.calculateAndCallCustomABI({
      contractAddress: environment.contractAddress,
      method: 'setDistPercentage',
      params: [type, newValue],
      callType: 'send',
      urlABI: this.mainRedABI
    });
  }

  async mainred_admin_setWalletCo(type: number, newWallet: string) {
    return this.calculateAndCallCustomABI({
      contractAddress: environment.contractAddress,
      method: 'setWalletCo',
      params: [type, newWallet],
      callType: 'send',
      urlABI: this.mainRedABI
    });
  }

  async mainred_admin_removeUser(wallet: string) {
    return this.calculateAndCallCustomABI({
      contractAddress: environment.contractAddress,
      method: 'removeUser',
      params: [wallet],
      callType: 'send',
      urlABI: this.mainRedABI
    });
  }

  async mainred_admin_renounceAdmin() {
    return this.calculateAndCallCustomABI({
      contractAddress: environment.contractAddress,
      method: 'renounceAdmin',
      callType: 'send',
      urlABI: this.mainRedABI
    });
  }

  /** ===============================================================
 *                MAINRED SECURITY Methods
 ================================================================ */

  async mainred_security_isAdmin() {
    const account = this.accounts[0];
    return this.calculateAndCallCustomABI({
      contractAddress: environment.contractAddress,
      method: 'isAdmin',
      params: [account],
      callType: 'call',
      urlABI: this.mainRedABI
    });
  }

  async mainred_security_isUser() {
    const account = this.accounts[0];
    return this.calculateAndCallCustomABI({
      contractAddress: environment.contractAddress,
      method: 'isUser',
      params: [account],
      callType: 'call',
      urlABI: this.mainRedABI
    });
  }
  /** ===============================================================
  *                MAINRED USER Methods
  ================================================================ */

  async mainred_user_updateToken(id: number, type: number, addr: string, dcm: number, bool: boolean) {
    return this.calculateAndCallCustomABI({
      contractAddress: environment.contractAddress,
      method: 'updateToken',
      params: [id, type, addr, dcm, bool],
      callType: 'send',
      urlABI: this.mainRedABI
    });
  }

  async mainred_user_addToken(addr: string, orc: string, orcDcm: number, active: boolean, native: boolean) {
    return this.calculateAndCallCustomABI({
      contractAddress: environment.contractAddress,
      method: 'addToken',
      params: [addr, orc, orcDcm, active, native],
      callType: 'send',
      urlABI: this.mainRedABI
    });
  }

  async mainred_user_updateUserAsAdmin(id: number, type: number, num: number, bool: boolean) {
    return this.calculateAndCallCustomABI({
      contractAddress: environment.contractAddress,
      method: 'updateUserAsAdmin',
      params: [id, type, num, bool],
      callType: 'send',
      urlABI: this.mainRedABI
    });
  }


  ///// Toodoo
  async mainred_user_addSale(id: number, type: number, num: number, bool: boolean) {
    return this.calculateAndCallCustomABI({
      contractAddress: environment.contractAddress,
      method: 'updateUserAsAdmin',
      params: [id, type, num, bool],
      callType: 'send',
      urlABI: this.mainRedABI
    });
  }

  async mainred_user_removePackage(id: number) {
    return this.calculateAndCallCustomABI({
      contractAddress: environment.contractAddress,
      method: 'removePackage',
      params: [id],
      callType: 'send',
      urlABI: this.mainRedABI
    });
  }

  /// que es el point
  async mainred_user_editPackage(type: number, id: number, price: string, point: number, bool: boolean) {
    return this.calculateAndCallCustomABI({
      contractAddress: environment.contractAddress,
      method: 'editPackage',
      params: [type, id, price, point, bool],
      callType: 'send',
      urlABI: this.mainRedABI
    });
  }


  async mainred_user_addPackage(p: string, point: number) {
    return this.calculateAndCallCustomABI({
      contractAddress: environment.contractAddress,
      method: 'addPackage',
      params: [p, point],
      callType: 'send',
      urlABI: this.mainRedABI
    });
  }

  async mainred_user_setMembershipDuration(durationt: number) {
    return this.calculateAndCallCustomABI({
      contractAddress: environment.contractAddress,
      method: 'setMembershipDuration',
      params: [durationt],
      callType: 'send',
      urlABI: this.mainRedABI
    });
  }

  async mainred_user_setMembershipPrice(price: string) {
    return this.calculateAndCallCustomABI({
      contractAddress: environment.contractAddress,
      method: 'setMembershipDuration',
      params: [price],
      callType: 'send',
      urlABI: this.mainRedABI
    });
  }

  async mainred_user_addMembership(address: string, createdAt: number, expiresAt: number) {
    return this.calculateAndCallCustomABI({
      contractAddress: environment.contractAddress,
      method: 'addMembership',
      params: [address, createdAt, expiresAt],
      callType: 'send',
      urlABI: this.mainRedABI
    });
  }

  /** ===============================================================
   *                MAINRED WHITELIST Methods
   ================================================================ */

  async mainred_whitelist_tokensList() {
    return this.calculateAndCallCustomABI({
      contractAddress: environment.contractAddress,
      method: 'tokensList',
      params: null,
      callType: 'call',
      urlABI: this.mainRedABI
    });
  }

  async mainred_whitelist_getTokenByAddr(addr: string) {
    return this.calculateAndCallCustomABI({
      contractAddress: environment.contractAddress,
      method: 'getTokenByAddr',
      params: [addr],
      callType: 'call',
      urlABI: this.mainRedABI
    });
  }

  /** ===============================================================
   *                MAINRED PACKAGES Methods
   ================================================================ */

  async mainred_packages_whitelistPackageCount() {
    return this.calculateAndCallCustomABI({
      contractAddress: environment.contractAddress,
      method: 'whitelistPackageCount',
      params: null,
      callType: 'call',
      urlABI: this.mainRedABI
    });
  }

  async mainred_packages_getPackage(addr: string) {
    return this.calculateAndCallCustomABI({
      contractAddress: environment.contractAddress,
      method: 'getPackage',
      params: [addr],
      callType: 'call',
      urlABI: this.mainRedABI
    });
  }

  async mainred_packages_WhitelistPackage(index: string) {
    return this.calculateAndCallCustomABI({
      contractAddress: environment.contractAddress,
      method: 'WhitelistPackage',
      params: [index],
      callType: 'call',
      urlABI: this.mainRedABI
    });
  }

  async mainred_packages_getPackageList(_f: number, _t: number) {
    return this.calculateAndCallCustomABI({
      contractAddress: environment.contractAddress,
      method: 'getPackageList',
      params: [_f, _t],
      callType: 'call',
      urlABI: this.mainRedABI
    });
  }

  async mainred_packages_getPackageFee() {
    return this.calculateAndCallCustomABI({
      contractAddress: environment.contractAddress,
      method: 'bonusFeeUSD',
      callType: 'call',
      urlABI: this.mainRedABI
    });
  }


  /** ===============================================================
  *               SMART CONTRACT - WITHDRAW Methods PROVISIONAL
  ================================================================ */


  /**
   * 
   * @param sc 
   * @returns 
   */
  getUserCount(sc: string) {
    return this.calculateAndCallCustomABI({
      contractAddress: sc,
      method: 'userCount',
      params: [],
      callType: 'call',
      urlABI: this.ncwABI
    });
  }

  /**
   * 
   * @param address 
   * @param sc 
   * @returns 
   */
  getBonusDirectCount(sc: string) {
    return this.calculateAndCallCustomABI({
      contractAddress: sc,
      method: 'bonusDirectCount',
      params: [],
      callType: 'call',
      urlABI: this.ncwABI
    });
  }


  /**
   * 
   * @param sc 
   * @param index 
   * @returns 
   */
  getBonusDirect(sc: string, address: string) {
    return this.calculateAndCallCustomABI({
      contractAddress: sc,
      method: 'bonusDirect',
      params: [address],
      callType: 'call',
      urlABI: this.ncwABI
    });
  }

  /**
   * 
   * @param sc 
   * @param index 
   * @returns 
   */
  getUserList(sc: string, index: string) {
    return this.calculateAndCallCustomABI({
      contractAddress: sc,
      method: 'userList',
      params: [index],
      callType: 'call',
      urlABI: this.ncwABI
    });
  }


  /**
   * 
   * @param _amount 
   * @returns 
   */
  async ncw_withdrawUser(_amount: string, contractAddress: string) {


    /**
     * TODO: este metedodo es para retirar el dinero 
     */

    /** Obtener fee de transacciones */
    let fee = await this.mainred_buy_getInternalFee();
    // if (!environment.production) {
    //   fee = '0';
    // }

    console.log('fee', fee);
    console.log('amount', _amount);
    return await this.calculateAndCallCustomABI({
      contractAddress: contractAddress,
      method: 'withdrawUser',
      params: [_amount],
      callType: 'send',
      optionals: { value: fee },
      urlABI: this.ncwABI
    });
  }


  /**
   * 
   * @param address 
   * @returns 
   */
  async getAvailable(address: string) {

    /**
     * TODO: este metodo es para obtener el dinero disponible
     * es provisional se tiene que revisar y adaptar
     */
    const result = await this.ncw_getUser(address)
    return result
  }



  /**
   * 
   * @returns 
   */
  async ncw_getUser(address: string) {
    const index = await this.ncw_userIndex(address);
    return this.calculateAndCallCustomABI({
      contractAddress: address,
      method: 'getUser',
      params: [index],
      callType: 'call',
      urlABI: this.ncwABI
    });
  }

  /**
   * 
   * @returns 
   */
  async ncw_userIndex(address: string) {
    const account = this.accounts[0];
    return this.calculateAndCallCustomABI({
      contractAddress: address,
      method: 'userIndex',
      params: [account],
      callType: 'call',
      urlABI: this.ncwABI
    });
  }


  /**
   * 
   * @param address  address of contract
   * @returns 
   */
  async ncw_bonusDirect(address: string) {
    const account = this.accounts[0];
    return this.calculateAndCallCustomABI({
      contractAddress: address,
      method: 'bonusDirect',
      params: [account],
      callType: 'call',
      urlABI: this.ncwABI
    });
  }






  /** ===============================================================
   *                MAINRED USER Methods
   ================================================================ */

  async mainred_user_addUserRed(code: string, hostSide: string, referredBy: string) {

    /** Obtener fee de transacciones */
    const fee = await this.mainred_buy_getInternalFee();

    return this.calculateAndCallCustomABI({
      contractAddress: environment.contractAddress,
      method: 'addUserRed',
      params: [code, hostSide, referredBy],
      callType: 'send',
      optionals: { value: fee },
      urlABI: this.mainRedABI
    });
  }

  async mainred_user_userCodeExist(code: string) {
    return this.calculateAndCallCustomABI({
      contractAddress: environment.contractAddress,
      method: 'userCodeExist',
      params: [code],
      callType: 'call',
      urlABI: this.mainRedABI
    });
  }

  async mainred_user_listUsers(index: any) {
    return this.calculateAndCallCustomABI({
      contractAddress: environment.contractAddress,
      method: 'listUsers',
      params: [index],
      callType: 'call',
      urlABI: this.mainRedABI
    });
  }

  async mainred_user_listUserWallet(addr: string) {
    return this.calculateAndCallCustomABI({
      contractAddress: environment.contractAddress,
      method: 'listUserWallet',
      params: [addr],
      callType: 'call',
      urlABI: this.mainRedABI
    });
  }

  async mainred_user_listUsersCode(code: string) {
    return this.calculateAndCallCustomABI({
      contractAddress: environment.contractAddress,
      method: 'listUsersCode',
      params: [code],
      callType: 'call',
      urlABI: this.mainRedABI
    });
  }

  async mainred_user_getUserByCode(code: string) {
    return this.calculateAndCallCustomABI({
      contractAddress: environment.contractAddress,
      method: 'getUserByCode',
      params: [code],
      callType: 'call',
      urlABI: this.mainRedABI
    });
  }

  async mainred_user_getByAddress(addr: string) {
    const raw = await this.mainred_user_listUserWallet(addr);
    if (!raw.exist) { return null; }
    return await this.mainred_user_listUsers(raw.index);
  }

  async mainred_user_getReferredByWallet(addr: string) {
    return this.calculateAndCallCustomABI({
      contractAddress: environment.contractAddress,
      method: 'getReferredByWallet',
      params: [addr],
      callType: 'call',
      urlABI: this.mainRedABI
    });
  }


  /** ===============================================================
   *             MAINRED MEMBERSHIP Methods
   ================================================================ */

  async mainred_membership_listMemberships(addr: string) {
    return this.calculateAndCallCustomABI({
      contractAddress: environment.contractAddress,
      method: 'listMemberships',
      params: [addr],
      callType: 'call',
      urlABI: this.mainRedABI
    });
  }

  async mainred_membership_isActiveMembership(addr: string) {
    return this.calculateAndCallCustomABI({
      contractAddress: environment.contractAddress,
      method: 'isActiveMembership',
      params: [addr],
      callType: 'call',
      urlABI: this.mainRedABI
    });
  }

  async mainred_membership_getMembershipPrice() {
    return this.calculateAndCallCustomABI({
      contractAddress: environment.contractAddress,
      method: 'membershipPrice',
      params: [],
      callType: 'call',
      urlABI: this.mainRedABI
    });
  }



  /** ===============================================================
  *              MAINRED MEMBERSHIP BUY Methods
  ================================================================ */

  async mainred_membership_buyMembershipNative(token: string, amount: string) {
    return this.calculateAndCallCustomABI({
      contractAddress: environment.contractAddress,
      method: 'buyMembership',
      params: [token],
      callType: 'send',
      optionals: { value: amount },
      urlABI: this.mainRedABI
    });
  }

  async mainred_membership_buyMembershipERC20(token: string) {
    /** Obtener fee de transacciones */
    const fee = await this.mainred_buy_getInternalFee();

    return this.calculateAndCallCustomABI({
      contractAddress: environment.contractAddress,
      method: 'buyMembership',
      params: [token],
      optionals: { value: fee },
      callType: 'send',
      urlABI: this.mainRedABI
    });
  }


  /** ===============================================================
   *             MAINRED BUY PACKAGE Methods
   ================================================================ */

  async mainred_buy_getInternalFee() {
    const fee = await this.mainred_oracle_parseUSDtoToken(
      toWei(0.5),
      "0x000000000000000000000000000000000000dEaD",
      true
    );
    return fee;
  }


  async mainred_buy_bonusFeeUSD() {
    return await this.calculateAndCallCustomABI({
      contractAddress: environment.contractAddress,
      method: 'bonusFeeUSD',
      params: [],
      callType: 'call',
      urlABI: this.mainRedABI
    });
  }

  async mainred_buy_buyPackageNative(
    token: string,
    pId: any,
    userCode: string,
    referredBy: string,
    hostSide: string,
    seed: string,
    level: number,
    amount: string,
  ) {
    // const feeUSD = await this.mainred_buy_bonusFeeUSD();
    // console.log('feeUSD', feeUSD);
    // const transforTobnb = await this.mainred_oracle_parseUSDtoToken(feeUSD, token, true);
    // console.log('transforTobnb', transforTobnb);

    // const amountTotal = Number(fromWei(amount, 18)) + Number(fromWei(transforTobnb, 18));
    // console.log('amountTotal', amountTotal);

    return this.calculateAndCallCustomABI({
      contractAddress: environment.contractAddress,
      method: 'buyPackage',
      params: [
        [
          token,
          pId,
          userCode,
          referredBy,
          hostSide,
          seed,
          level
        ]
      ],
      callType: 'send',
      // optionals: { value: toWei(amountTotal.toFixed(18), 18) },
      optionals: { value: amount },
      urlABI: this.mainRedABI
    });
  }

  async mainred_buy_buyPackageRegular(
    token: string,
    pId: any,
    userCode: string,
    referredBy: string,
    hostSide: string,
    seed: string,
    level: number,
  ) {

    /** Obtener fee interno por transacción */
    const internalTxFee = await this.mainred_buy_getInternalFee();

    return this.calculateAndCallCustomABI({
      contractAddress: environment.contractAddress,
      method: 'buyPackage',
      params: [
        [
          token,
          pId,
          userCode,
          referredBy,
          hostSide,
          seed,
          level
        ]
      ],
      optionals: { value: internalTxFee },
      callType: 'send',
      urlABI: this.mainRedABI
    });
  }


  /** ===============================================================
   *                   MAINRED SALES Methods
   ================================================================ */

  async mainred_sale_countSalesByUserCode(code: string) {
    const snapshot = await this.calculateAndCallCustomABI({
      contractAddress: environment.contractAddress,
      method: 'countSales',
      params: [code],
      callType: 'call',
      urlABI: this.mainRedABI
    });

    return Number(snapshot);
  }


  /**
   * 
   * @param contractAddress  // Dirección del contrato del token
   * @param fromAddress   // Tu dirección en MetaMask
   * @param toAddress   // Dirección del receptor
   * @param amount  // Ajusta según tus necesidades y decimales del token.
   * @returns 
   */
  async sendToken(contractAddress: any, toAddress: any, amount: any) {
    try {
      // Primero, aprueba la transferencia

      console.log(1, {
        contractAddress,
        toAddress,
        amount
      })


      const amountToSend = toWei(amount);
      const fromAddress = this.accounts[0];

      console.log(2, {
        fromAddress,
        amountToSend,
        toAddress,
        contractAddress
      });

      // Ahora realiza la transferencia
      const tx = await this.calculateAndCallCustomABI({
        contractAddress: environment.contractAddress,
        method: 'transfer',
        params: [toAddress, amountToSend],
        callType: 'send',
        urlABI: this.erc20ABI
      });

      console.log(`Transfer Transaction Hash: ${tx.transactionHash}`);

      return {
        tx,
        amount,
        amountToSend,
        fromAddress
      }  // Retorna el hash de la transacción

    } catch (err) {
      console.error(err);
      throw err;
    }
  }



  async mainred_sale_countMyBuyByUserCode(code: string) {
    const snapshot = await this.calculateAndCallCustomABI({
      contractAddress: environment.contractAddress,
      method: 'countMyBuy',
      params: [code],
      callType: 'call',
      urlABI: this.mainRedABI
    });

    return Number(snapshot);
  }

  async mainred_sale_listSalesByCodeAndIndex(code: string, index: any) {
    return this.calculateAndCallCustomABI({
      contractAddress: environment.contractAddress,
      method: 'listSales',
      params: [code, index],
      callType: 'call',
      urlABI: this.mainRedABI
    });
  }


  async mainred_sale_listMyBuyByCodeAndIndex(code: string, index: any) {
    return this.calculateAndCallCustomABI({
      contractAddress: environment.contractAddress,
      method: 'listMyBuy',
      params: [code, index],
      callType: 'call',
      urlABI: this.mainRedABI
    });
  }

  async mainred_sale_getUserDirectBonusByAddr(addr: string) {
    const userDoc = await this.mainred_user_getByAddress(addr);
    const userSaleCount = await this.mainred_sale_countSalesByUserCode(userDoc.myCode);

    if (userSaleCount == 0) { return 0; }
    // console.log('userSaleCount', userSaleCount);

    const raws = customArrayNumber(0, userSaleCount);
    const toAwait = [];
    for (const chunkList of chunkArray(raws, 50)) {
      const snapshot = await Promise.all(
        chunkList.map((index) => this.mainred_sale_listSalesByCodeAndIndex(userDoc.myCode, index))
      );

      // console.log('snapshot', snapshot);
      toAwait.push(...snapshot);
    }

    return toAwait.map((row) => row.amountUSD)
      .reduce((a, b) => new BigNumber(a).plus(b).toFixed(), "0");
  }

  async mainred_sale_getUserTotalByAddr(addr: string) {
    const userDoc = await this.mainred_user_getByAddress(addr);
    const userSaleCount = await this.mainred_sale_countMyBuyByUserCode(userDoc.myCode);

    /** Obtener fee adicional por paquete */
    const packageFee = await this.mainred_packages_getPackageFee();

    if (userSaleCount == 0) { return 0; }
    // console.log('userSaleCount', userSaleCount);

    const raws = customArrayNumber(0, userSaleCount);
    const toAwait = [];
    for (const chunkList of chunkArray(raws, 50)) {
      const snapshot = await Promise.all(
        chunkList.map((index) => this.mainred_sale_listMyBuyByCodeAndIndex(userDoc.myCode, index))
      );

      // console.log('snapshot', snapshot);
      toAwait.push(...snapshot);
    }

    return toAwait
      // .filter((row) => Number(fromWei(row.amountUSD)) != 50)
      .map((row) => new BigNumber(row.amountUSD).minus(packageFee).toFixed())
      .reduce((a, b) => new BigNumber(a).plus(b).toFixed(), "0");
  }

  async mainred_sale_getCountSales() {
    return this.calculateAndCallCustomABI({
      contractAddress: environment.contractAddress,
      method: 'countSale',
      params: null,
      callType: 'call',
      urlABI: this.mainRedABI
    });
  }

  async mainred_sale_addSale(
    addr: string,
    addrToken: string,
    packageId: number,
    codeBuyer: string,
    point: string,
    amountToken: string,
    amountUSD: string,
    level: string | number,
    seed: string,
    codeReferrer: string,
    hostSide: string,
  ) {
    const saleID = await this.mainred_sale_getCountSales();
    const currentTimeBlock = getCurrentDateTimeBlock();

    // console.log('mainred_sale_addSale', {
    //   addr,
    //   addrToken,
    //   packageId,
    //   codeBuyer,
    //   point,
    //   amountToken,
    //   amountUSD,
    //   level,
    //   seed,
    //   codeReferrer,
    //   hostSide,
    //   currentTimeBlock,
    //   saleID,
    // });

    return this.calculateAndCallCustomABI({
      contractAddress: environment.contractAddress,
      method: 'addSale',
      params: [
        [
          addr,
          addrToken,
          packageId,
          codeBuyer,
          point,
          amountToken,
          amountUSD,
          level,
          seed,
          codeReferrer,
          hostSide,
          currentTimeBlock,
          saleID
        ]
      ],
      callType: 'send',
      urlABI: this.mainRedABI
    });
  }


  /** ===============================================================
   *       Méthodo genérico para llamadas al SC personalizado
   * ================================================================
   * @param data
   * @param data.contractAddress
   * @param data.method
   * @param data.params
   * @param data.callType           'call' / 'send'
   * @param data.optionals
   * @param data.urlABI
   */
  async calculateAndCallCustomABI(data: any) {
    const {
      contractAddress,
      method,
      params = null,
      callType = 'send',
      optionals = {},
      urlABI = this.erc20ABI,
    } = data;

    try {
      // Cargar ABI del contrato
      const contractABI: any = await this.abiService.getABIByUrl(urlABI);


      // cargamos la abi de contracto secundarios con el metodo que necesitamos
      const uToken = this.getAbiContract(
        [contractABI[method]],
        contractAddress
      );

      const contractMethod = !params
        ? uToken.methods[method]()
        : uToken.methods[method](...params);

      if (callType === 'send') {


        const [account] = this.accounts;
        optionals.from = account;

        const gasPriceData: any = await this.bscGasSrv.getGasPrice();
        // Convertimos el FastGasPrice de gwei a wei.
        const fastGasPriceInGwei = gasPriceData.result.FastGasPrice;
        const fastGasPriceInWei = toGwei(fastGasPriceInGwei);



        const gasFee = await contractMethod.estimateGas(optionals);
        optionals.gasPrice = fastGasPriceInWei; // 
        optionals.gas = gasFee;
      }

      // console.log('optionals', optionals);

      const result = await contractMethod[callType](optionals);

      return result;
    } catch (err: any) {
      console.log({ params: data });
      console.log('Error on ContractService@calculateAndCallCustomABI', JSON.stringify(err));
      console.log('Error on ContractService@calculateAndCallCustomABI', err);
      throw new Error(err);
    }
  }


  /**
  * Obteber nueva instancia WEB3 de un SC a través del ABI ingresado
  * @param token_abi             ABI Cargado
  * @param token_address         Dirección del SC
  * @returns
  */
  getAbiContract(token_abi: any, token_address: any) {
    let uToken: any = new this.web3js.eth.Contract(token_abi, token_address);
    return uToken;
  }

}


/**
 * Validat si el código de usuario ya se encuentra registrado
 * @param service 
 * @returns 
 */
export function checkCodeAvailable(service: Web3Service): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return from(service.mainred_user_getUserByCode(`${control.value}`.trim().toLowerCase()))
      .pipe(
        // tap((result) => console.log('mainred_user_getUserByCode', result)),
        map((data) => {
          return (data.active) ? { referredCodeAvailable: true } : null;
        })
      );
  }
}

/**
 * Validar si la dirección se encuentra registrada en el contrato
 * @param service 
 * @returns 
 */
export function checkUserBlockStored(service: Web3Service): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return from(service.mainred_user_getByAddress(control.value))
      .pipe(
        // tap((result) => console.log('mainred_user_getUserByCode', result)),
        map((data) => (!data) ? { userBlockStored: true } : null)
      );
  }
}

/**
 * Válidar si la dirección de usuario no se encuentra registrada
 * @param service 
 * @returns 
 */
export function checkUserBlockDoesntStored(service: Web3Service): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return from(service.mainred_user_getByAddress(control.value))
      .pipe(
        // tap((result) => console.log('mainred_user_getByAddress', result)),
        map((data) => (!data) ? null : { userBlockStored: true })
      );
  }
}

/**
 * Válidar si el código de usuario se encuentra registrado
 * @param service 
 * @returns 
 */
export function checkUserCodeBlockStored(service: Web3Service): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return from(service.mainred_user_getUserByCode(`${control.value}`.trim().toLowerCase()))
      .pipe(
        // tap((result) => console.log('checkUserCodeBlockStored', result)),
        map((data: any) => (data && data.active) ? null : { userCodeBlockStored: true })
      );
  }
}
