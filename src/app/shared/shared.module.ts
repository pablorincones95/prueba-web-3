import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SwiperModule } from "swiper/angular";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { PipesModule } from "../pipes/pipes.module";
import { HeaderComponent } from "./header/header.component";
import { FormCreateTaskComponent } from "./forms/form-create-task/form-create-task.component";
import { ListsTaskComponent } from "./lists-task/lists-task.component";

@NgModule({
  declarations: [HeaderComponent, FormCreateTaskComponent, ListsTaskComponent],
  exports: [HeaderComponent, FormCreateTaskComponent, ListsTaskComponent],
  imports: [
    CommonModule,
    RouterModule,
    SwiperModule,
    FormsModule,
    PipesModule,
    ReactiveFormsModule,
  ],
})
export class SharedModule {}
