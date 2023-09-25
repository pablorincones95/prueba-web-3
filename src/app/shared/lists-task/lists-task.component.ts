import { Component, OnInit } from "@angular/core";
import { Web3Service } from "src/app/services/contract/web3.service";
import { TaskService } from "src/app/services/firebase/task.service";
import { Sweetalert2Service } from "src/app/services/sweetalert2.service";

@Component({
  selector: "app-lists-task",
  templateUrl: "./lists-task.component.html",
  styleUrls: ["./lists-task.component.css"],
})
export class ListsTaskComponent implements OnInit {
  listTasks: any;
  public loading: boolean = false;
  constructor(
    private tasksService: TaskService,
    private web3Service: Web3Service,
    private sweetAlert2Srv: Sweetalert2Service
  ) {}

  ngOnInit() {
    //ejecutar la funcion de obtener tareas
    this.getListTasks();
    this.web3Service.listTasksContract();
  }

  // funcion para obtener tareas
  async getListTasks() {
    await this.tasksService.getAll().subscribe((values: any) => {
      this.listTasks = [];
      values.forEach((element: any) => {
        this.listTasks.push([
          { id: element.payload.doc.id, data: element.payload.doc.data() },
        ]);
      });
      console.log(this.listTasks);
    });
  }

  // funcion de completar la tarea
  async completedTask(idContract: any, idDB: any) {
    try {
      this.loading = true;

      //convertir el id de la tarea a numerico para el contrato
      let _id = Number(idContract);

      // se ejecuta la funcion para completar la tarea del contrato
      await this.web3Service.completedTasksContract(_id, idDB);

      this.sweetAlert2Srv.showSuccess("Tarea completada");
    } catch (err: any) {
      console.log("Error on completed task", err);
      await this.sweetAlert2Srv.showWarning(err.message);
      window.location.reload();
      return;
    } finally {
      this.loading = false;
    }
  }
}
