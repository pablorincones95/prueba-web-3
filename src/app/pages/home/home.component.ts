import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  formulario!: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.formulario = this.formBuilder.group({
      monto: ['', [Validators.required, Validators.min(0)]],  // Puedes añadir más validadores según tus necesidades
      terminos: [false, Validators.requiredTrue]
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.formulario.valid) {
      console.log(this.formulario.value);
      // Aquí puedes hacer lo que quieras con la data del formulario
    } else {
      console.warn("El formulario no es válido");
    }
  }
}
