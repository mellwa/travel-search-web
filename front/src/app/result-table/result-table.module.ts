import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ResultTableComponent} from "./result-table.component";
import {MessageModule} from "../message/message.module";
import {TableModule} from "../table/table.module";
import {ResultTableService} from "./result-table.service";

@NgModule({
  imports: [
    CommonModule,
    MessageModule,
    TableModule
  ],
  declarations: [ResultTableComponent],
  exports:[ResultTableComponent],
  providers: [ResultTableService]
})
export class ResultTableModule { }
