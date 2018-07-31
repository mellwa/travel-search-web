import { Injectable } from '@angular/core';
import {TableConstant} from "./TableConstant";
import {Config} from "../config";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class TableService {

  constructor(private http: HttpClient) {

  }

  createFavoritesLocalStorage() {
    let favorites = localStorage.getItem(TableConstant.FAVORITES);
    if(!favorites) {
      localStorage.setItem(TableConstant.FAVORITES, '[]');
    }
  }

  addToFavorite(data) {
    if(this.checkIfDataSaved(data)) return;
    this.createFavoritesLocalStorage();
    let favorites = this.getStorageList();
    var saving_data = Object.assign({}, data);
    favorites.push(saving_data);
    localStorage.setItem(TableConstant.FAVORITES, JSON.stringify(favorites));
  }

  removeDataById(placeId) {
    let favorites_str = localStorage.getItem(TableConstant.FAVORITES);
    let favorites = JSON.parse(favorites_str);
    for(var i = 0; i < favorites.length; i++) {
      let element = favorites[i];
      if(element['place_id'] == placeId) {
        favorites.splice(i, 1)
      }
    }
    localStorage.setItem(TableConstant.FAVORITES, JSON.stringify(favorites));
  }

  removeData(data) {
    this.removeDataById(data['place_id']);
  }

  getStorageList() {
    this.createFavoritesLocalStorage();
    let favorites_str = localStorage.getItem(TableConstant.FAVORITES);
    return JSON.parse(favorites_str);
  }

  fetchDataListFromLocalStorage() {
    this.createFavoritesLocalStorage();
    let favorites_str = localStorage.getItem(TableConstant.FAVORITES);
    let favorites = JSON.parse(favorites_str);
    for(var i = 0; i < favorites.length; i++) {
      let element = favorites[i];
      element['index'] = i+1
    }
    return favorites;
  }

  checkIfDataSavedById(placeId) {
    let favorites = this.getStorageList();
    for(var i = 0; i < favorites.length; i++) {
      let element = favorites[i];
      if(placeId == element['place_id']) {
        return true
      }
    }
    return false;
  }

  checkIfDataSaved(data) {
    let placeId = data['place_id'];
    return this.checkIfDataSavedById(placeId);
  }



}
