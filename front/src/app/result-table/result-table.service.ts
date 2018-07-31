import { Injectable } from '@angular/core';
import {Config} from "../config";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable()
export class ResultTableService {

  table_data = [];
  next_page_token = '';
  prev_page_data = [];

  constructor(private http: HttpClient) { }

  fetchNextPageResult(callback) {
    if(!this.next_page_token.trim()) return;
    var searchUrl = Config.url().next_page_api+"?";
    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json'
    //   })
    // };
    searchUrl = searchUrl + "pagetoken=" + this.next_page_token;
    searchUrl = encodeURI(searchUrl);
    this.http.get(searchUrl).subscribe((data) => {
      var table_data = [];

      if (data['next_page_token']) {
        this.next_page_token = data['next_page_token'];
      }
      else {
        this.next_page_token = '';
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
        table_data.push(obj);
      }
      this.table_data = table_data;
      if (typeof callback == 'function') {
        callback(table_data);
      }
    }, (error) => {
      console.error('next page error',error);
    });
  }

  toPrevData() {
    if(this.prev_page_data.length == 0) return;
    var data = this.prev_page_data.pop();
    this.next_page_token = data['next_page_token'];
    this.table_data = data['results'];
    return this.table_data;
  }

}
