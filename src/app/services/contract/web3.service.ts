import { Inject, Injectable, OnInit } from "@angular/core";
import { WEB3 } from "../../core/web3";
import { BehaviorSubject, Subject } from "rxjs";
import Web3Modal from "web3modal";
import { environment } from "src/environments/environment";
import Web3 from "web3";
declare let window: any;
import WalletConnectProvider from "@walletconnect/web3-provider";
import { TaskAbi } from "../../../assets/abi/tasksAbi.js";
import { TaskService } from "../firebase/task.service";

@Injectable({
  providedIn: "root",
})
export class Web3Service implements OnInit {
  /** web3 Instance */
  private web3js: any;

  /** Instancia del provider */
  private provider: any;

  /** Arreglo de wallets conectadas */
  private accounts: any;

  /** web3Modal Instance */
  private web3Modal: any;

  /** variable de tareas */
  private tasks: any;

  /** Contrato de tareas ABI */
  private tasksAbi: any = "/assets/abi/abi.json";

  /** Direccion de contratro */
  public contractAddress = environment.contractAddress;

  /** Instancia para obtener wallets conectadas */
  private accountStatusSource = new Subject<any>();
  accountStatus$ = this.accountStatusSource.asObservable();

  // addressUser: any = new BehaviorSubject<string>("");
  // loginUser: any = new BehaviorSubject<string>("");

  public listTasks: any;
  public listTask: any;

  constructor(
    @Inject(WEB3) private web3: Web3,
    private tasksService: TaskService
  ) {
    //confugurar provider
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: "INFURA_ID",
        },
      },
    };

    this.web3Modal = new Web3Modal({
      network: "tesnet",
      cacheProvider: true,
      providerOptions,
      theme: {
        background: "rgb(39, 49, 56)",
        main: "rgb(199, 199, 199)",
        secondary: "rgb(136, 136, 136)",
        border: "rgba(195, 195, 195, 0.14)",
        hover: "rgb(16, 26, 32)",
      },
    });
  }

  async ngOnInit(): Promise<void> {
    // verirficar que este la red etherrum
    if (window.ethereum) {
      this.web3 = new Web3(window.ethereum);
      window.ethereum.enable().catch(console.error);
    } else if (window.web3) {
      this.web3 = new Web3(window.web3.currentProvider);
    } else {
      console.log(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  }

  // funcion para conectar la wallet
  async connectAccount() {
    this.web3Modal.clearCachedProvider();
    this.provider = await this.web3Modal.connect();
    this.web3js = new Web3(this.provider);
    this.accounts = await this.web3js.eth.getAccounts();
    this.accountStatusSource.next(this.accounts);
  }

  // funcion para listar las tareas desde el contrato
  async listTasksContract() {
    this.provider = await this.web3Modal.connect();
    this.web3js = new Web3(this.provider);
    this.accounts = await this.web3js.eth.getAccounts();
    this.tasks = new this.web3js.eth.Contract(TaskAbi, this.contractAddress);

    // obtener cuantas tareas hay en el contrato
    const countsTask = await this.tasks.methods.taskCount().call({
      from: this.accounts[0],
    });

    for (var i = 0; i < countsTask; i++) {
      console.log(i);
      this.listTasks = await this.tasks.methods.tasks(i).call(
        {
          from: this.accounts[0],
        },
        (error: any, tokens: any) => {
          const propertyNames = {
            id: tokens.id,
            title: tokens.title,
            completed: tokens.completed,
          };

          this.listTask = [];
          this.listTask.push([
            {
              id: propertyNames.id,
              completed: propertyNames.completed,
              title: propertyNames.title,
            },
          ]);
          // return console.log(this.listTask);
        }
      );
    }

    return this.listTask;
  }

  // funcion para crear la tarea en el contrato y base de datos
  async createTasksContract(data: any) {
    this.provider = await this.web3Modal.connect();
    this.web3js = new Web3(this.provider);
    this.accounts = await this.web3js.eth.getAccounts();
    this.tasks = new this.web3js.eth.Contract(TaskAbi, this.contractAddress);
    const create = await this.tasks.methods
      .createTask(data.title)
      .send({
        from: this.accounts[0],
      })
      .on("receipt", async (receipt: any) => {
        console.log(receipt);
        let dataReturn = receipt.events.TaskCreated.returnValues;
        /** Construir documento para la tarea */
        const dataDB = {
          uid: dataReturn.id,
          title: data.title,
          priority: data.priority,
          completed: dataReturn.completed,
          comment: data.comment,
        };
        console.log("data", dataDB);
        // /** Registrar tarea base de datos */
        const uid = await this.tasksService.store(dataDB);
        console.log(uid);
      })
      .on("error", (error: any, receipt: any) => {
        console.log("error:", error, "receipt:", receipt);

        return error;
      });
    return create;
  }

  // funcion para completar la tarea en el contrato y base de datos
  async completedTasksContract(_id: number, idDB: string) {
    this.provider = await this.web3Modal.connect();
    this.web3js = new Web3(this.provider);
    this.accounts = await this.web3js.eth.getAccounts();
    this.tasks = new this.web3js.eth.Contract(TaskAbi, this.contractAddress);
    const create = await this.tasks.methods
      .completeTask(_id)
      .send({
        from: this.accounts[0],
      })
      .on("receipt", async (receipt: any) => {
        console.log(receipt);
        let dataReturn = receipt.events.TaskCompleted.returnValues;
        /** Construir documento para el cambio de completado de  la tarea */
        const dataDB = {
          completed: dataReturn.completed,
        };
        console.log("data", dataDB);
        // /** Registrar el cambio de complerado en la base de datos */
        const uid = await this.tasksService.update(idDB, dataDB);
        console.log(uid);
      })
      .on("error", (error: any, receipt: any) => {
        console.log("error:", error, "receipt:", receipt);
        return error;
      });
    return create;
  }
}
