import { Injectable } from '@angular/core';
import {Config} from "../config";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {FakeData} from "./data";

@Injectable()
export class DisplayService {

  fake_data = new FakeData();

  current_location = {
    lat: 34.02177,
    lng: -118.28538
  };

  my_location = {
    lat: 34.02177,
    lng: -118.28538
  };

  current_address = '';

  FAVORITES = 'favorites';

  constructor(private http: HttpClient) {

  }

  setMyLocation(my_location) {
    if(!my_location) return;
    if(!my_location['lat'] || !my_location['lng']) return;
    this.my_location.lat = my_location['lat'];
    this.my_location.lng = my_location['lng'];
  }

  getMyLocation() {
    return this.my_location;
  }

  fetchSearchResult(request, callback) {
    var searchUrl = Config.url().search_api + "?";
    if(request && request['keyword']) {
      searchUrl = searchUrl+'keyword='+request['keyword'];
      if(request['category']) {
        searchUrl = searchUrl + "&category=" + request['category'];
      }
      if(request['distance']){
        searchUrl = searchUrl + "&distance=" + request['distance'];
      }
      if(request['lat']){
        searchUrl = searchUrl + "&lat=" + request['lat'];
      }
      if(request['lon']) {
        searchUrl = searchUrl + "&lon=" + request['lon'];
      }
      if(request['address']) {
        searchUrl = searchUrl + "&address=" + request['address'];
      }
      searchUrl = encodeURI(searchUrl);
    }
    this.current_address = request['address'];

    console.log('request url '+searchUrl);
    this.http.get(searchUrl).subscribe((data) => {
      let table_data = this.getUsefulData(data);
      if (typeof callback == 'function') {
        callback(table_data);
      }
    }, (error) => {
      console.error('****', error);
      // var table_data = this.fake_data.fakePokeData();
      let table_data = null;
      if (typeof callback == 'function') {
        // if(error.status == 404) table_data = null;
        callback(table_data);
      }
    });
  }

  getUsefulData(data) {
    console.log(data);
    var table_data = null;
    try {
      table_data = {
        results: [],
        current_location: {
          lat: parseFloat(data['current_location']['lat']),
          lng: parseFloat(data['current_location']['lon'])
        },
        next_page_token: ''
      };
      this.current_location.lat = table_data.current_location.lat;
      this.current_location.lng = table_data.current_location.lng;

      if (data['next_page_token']) {
        table_data.next_page_token = data['next_page_token'];
      }

      var results = data['results'];
      for (var i = 0; i < results.length; i++) {
        var result = results[i];
        var obj = {};
        obj['index'] = i + 1;
        obj['category'] = result['icon'];
        obj['name'] = result['name'];
        obj['address'] = result['vicinity'];
        obj['place_id'] = result['place_id'];
        obj['location'] = result['geometry']['location'];
        table_data.results.push(obj);
      }
    }catch {
      table_data = {results:[]};
    }
    return table_data;
  }

  fetchYelpReviewsData(data, callback) {
    if(typeof callback != 'function') {
      return;
    }
    if(!data['address_components']) {
      callback(null);
      return;
    }
    let yelp_query = {
      name: '',
      address: '',
      city: '',
      state: '',
      country: ''
    };
    for(let i = 0; i < data['address_components'].length; i++) {
      var address_obj = data['address_components'][i];
      if(!address_obj || !address_obj['types']) continue;
      for(let j = 0; j < address_obj['types'].length; j++) {
        if(!address_obj['types']) continue;
        let type = address_obj['types'][j];
        if(type == 'locality'){
          yelp_query.city = address_obj['long_name'] ? address_obj['long_name'] : address_obj['short_name'];
        }
        if(type == 'administrative_area_level_1') {
          yelp_query.state = address_obj['short_name'];
        }
        if(type == 'country') {
          yelp_query.country = address_obj['short_name'];
        }
      }
      yelp_query.address = data['formatted_address'];
      yelp_query.name = data['name'];
    }
    let query_url = Config.url().yelp_api+"?name="+yelp_query.name+"&address="+yelp_query.address
      +"&city="+yelp_query.city+"&state="+yelp_query.state+"&country="+yelp_query.country;
    query_url = encodeURI(query_url);
    this.http.get(query_url).subscribe((data) => {
      if(!data || !data['reviews']) {
        callback(null);
        return;
      }
      callback(data['reviews']);
    },(error) => {
      console.error(error);
      callback(null);
    });
  }

  createFavoritesLocalStorage() {
    let favorites = localStorage.getItem(this.FAVORITES);
    if(!favorites) {
      localStorage.setItem(this.FAVORITES, '[]');
    }
  }

  addToFavorite(data) {
    console.log('add data to favorite', data);
    if(this.checkIfDataSaved(data)) return;
    this.createFavoritesLocalStorage();
    let favorites = this.getStorageList();
    var saving_data = Object.assign({}, data);
    favorites.push(saving_data);
    localStorage.setItem(this.FAVORITES, JSON.stringify(favorites));
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

  removeData(data) {
    this.removeDataById(data['place_id']);
  }

  getStorageList() {
    this.createFavoritesLocalStorage();
    let favorites_str = localStorage.getItem(this.FAVORITES);
    return JSON.parse(favorites_str);
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

  checkIfDataSavedById(placeId) {
    let favorites = this.getStorageList();
    for(var i = 0; i < favorites.length; i++) {
      let element = favorites[i];
      if(!element) continue;
      if(placeId == element['place_id']) {
        return true
      }
    }
    return false;
  }

  checkIfDataSaved(data) {
    if(!data) return false;
    let placeId = data['place_id'];
    return this.checkIfDataSavedById(placeId);
  }

}
