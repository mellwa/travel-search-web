import { Injectable } from '@angular/core';
import {TableConstant} from "../table/TableConstant";

@Injectable()
export class FavoritesService {

  all_page_data = [];
  FAVORITES = 'favorites';

  constructor() { }

  createFavoritesLocalStorage() {
    let favorites = localStorage.getItem(this.FAVORITES);
    if(!favorites) {
      localStorage.setItem(this.FAVORITES, '[]');
    }
  }

  fetchDataListFromLocalStorage() {
    this.createFavoritesLocalStorage();
    let favorites_str = localStorage.getItem(this.FAVORITES);
    let favorites = JSON.parse(favorites_str);
    for(var i = 0; i < favorites.length; i++) {
      let element = favorites[i];
      element['index'] = i+1
    }
    return favorites;
  }

  arrange_page_data() {
    this.all_page_data = [];
    let list = this.fetchDataListFromLocalStorage();
    let page = [];
    for(let i = 0; i < list.length; i++) {
      if(i%20 == 0 && i > 0) {
        this.all_page_data.push(page);
        page = [];
      }
      page.push(list[i]);
    }
    if(page.length > 0) {
      this.all_page_data.push(page);
    }
    console.log('rearrenge page data', this.all_page_data, list);
  }

  getPageData(index) {
    if(index > this.all_page_data.length - 1) {
      console.error('favorites page fetch exceeds');
      return;
    }
    return this.all_page_data[index];
  }

  removeDataById(placeId) {
    let favorites_str = localStorage.getItem(this.FAVORITES);
    let favorites = JSON.parse(favorites_str);
    for(var i = 0; i < favorites.length; i++) {
      let element = favorites[i];
      if(element['place_id'] == placeId) {
        favorites.splice(i, 1)
      }
    }
    localStorage.setItem(this.FAVORITES, JSON.stringify(favorites));
  }

}
