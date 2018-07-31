import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TableComponent} from "./table.component";
import {AgmCoreModule} from '@agm/core';
import {AppRoutingModule} from "../app-routing.module";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {GooglePlaceModule} from "ngx-google-places-autocomplete";
import {TableService} from "./table.service";
import {MessageModule} from "../message/message.module";

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    NgbModule,
    BrowserAnimationsModule,
    GooglePlaceModule,
    MessageModule,
    // AppRoutingModule,
    AgmCoreModule
  ],
  providers:[TableService],
  exports: [TableComponent],
  declarations: [TableComponent]
})
export class TableModule { }
