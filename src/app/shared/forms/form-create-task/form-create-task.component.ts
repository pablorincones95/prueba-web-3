import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Web3Service } from "src/app/services/contract/web3.service";
import { Sweetalert2Service } from "src/app/services/sweetalert2.service";

@Component({
  selector: "app-form-create-task",
  templateUrl: "./form-create-task.component.html",
  styleUrls: ["./form-create-task.component.css"],
})
export class FormCreateTaskComponent implements OnInit {
  public form!: FormGroup;
  public vm: any = {
    title: [
      { type: "required", message: "Requerido" },
      { type: "minlength", message: "Minimo 2 letras" },
    ],
    priority: [{ type: "required", message: "Requerido" }],
    comment: [{ type: "required", message: "Requerido" }],
  };
  public submit = false;
  public loading: boolean = false;

  constructor(
    public fb: FormBuilder,
    private sweetAlert2Srv: Sweetalert2Service,
    private web3Service: Web3Service
  ) {
    this.buildForm();
  }

  ngOnInit() {}

  get f() {
    return this.form.controls;
  }

  /**
   * Construir formulario
   */
  buildForm() {
    this.form = this.fb.group({
      title: ["", [Validators.required, Validators.minLength(2)]],
      priority: ["", [Validators.required]],
      comment: ["", [Validators.required]],
    });
  }

  /**
   * Al enviar formulario
   * @returns
   */
  async onSubmit() {
    try {
      this.submit = true;
      this.loading = true;
      const formData = this.form.value;
      console.log("formData", formData);

      if (!this.form.valid) {
        this.form.markAllAsTouched();
        return;
      }

      /** Construir datos para la tarea */
      const data = {
        title: formData.title.trim().toLowerCase(),
        priority: formData.priority.trim().toLowerCase(),
        completed: false,
        comment: formData.comment.trim(),
      };
      console.log("data", data);

      // funcion para registrar la tarea
      const result = await this.web3Service.createTasksContract(data);

      console.log(result);

      this.sweetAlert2Srv.showSuccess("El Registro Fue Exitoso");
    } catch (err: any) {
      console.log("Error on createtask.onSubmit", err);

      await this.sweetAlert2Srv.showWarning(err.message);
      window.location.reload();
      this.form.reset();
      return;
    } finally {
      this.loading = false;
    }
  }
}
