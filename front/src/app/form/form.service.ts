import { Injectable } from '@angular/core';
import {Config} from "../config";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable()
export class FormService {

  constructor(private http: HttpClient) {

  }

  fetchCurrentLocation() {
    const apiUrl = Config.url().ip_api;
    return this.http.get(apiUrl);
  }

}
