import { Component } from '@angular/core';
import {AppService} from "./app.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  destroy_display = false;
  form_data = {};

  constructor(private appService:AppService) {

  }

  nearByData(data) {
    console.error(data);
    this.destroy_display = true;
    setTimeout(()=> {
      this.destroy_display = false;
      this.form_data = Object.assign({}, data);
    }, 20);
  }

  clearDisplay() {
    console.log('click clear');
    this.form_data = {};
    this.destroy_display = true;
    setTimeout(() => {
      this.destroy_display = false;
    }, 20);
  }

}
