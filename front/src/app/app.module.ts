import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import {FormModule} from "./form/form.module";
import {HttpClientModule} from "@angular/common/http";
import {DisplayModule} from "./display/display.module";
import {AgmCoreModule} from "@agm/core"
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {AppService} from "./app.service";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormModule,
    DisplayModule,
    HttpClientModule,
    NgbModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBfNgCQIzlNLQiTyVI7qJfpHsufihMtVjE'
    })
  ],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
