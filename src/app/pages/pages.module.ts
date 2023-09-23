import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PagesRoutingModule } from './pages-routing.module';
import { RechargeComponent } from './recharge/recharge.component';
import { PipesModule } from '../pipes/pipes.module';



@NgModule({
  declarations: [
    RechargeComponent
  ],
  imports: [
    CommonModule,
    PipesModule,
    FormsModule,
    ReactiveFormsModule,
    PagesRoutingModule
  ]
})
export class PagesModule { }
