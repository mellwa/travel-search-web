import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {FormComponent} from "./form.component";
import {FormService} from "./form.service";
import {FormsModule} from "@angular/forms";
import {GooglePlaceModule} from "ngx-google-places-autocomplete";

@NgModule({
  declarations: [
    FormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    GooglePlaceModule
  ],
  exports: [FormComponent],
  providers: [FormService],
})
export class FormModule{}
