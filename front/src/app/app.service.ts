import { Injectable } from '@angular/core';
import {TableConstant} from "./table/TableConstant";

@Injectable()
export class AppService {

  constructor() {
    console.log('app service construct');
    this.createFavoritesLocalStorage();
  }

  createFavoritesLocalStorage() {
    let favorites = localStorage.getItem(TableConstant.FAVORITES);
    if(!favorites) {
      localStorage.setItem(TableConstant.FAVORITES, '[]');
    }
  }

}
