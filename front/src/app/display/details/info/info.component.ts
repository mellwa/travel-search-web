import {Component, Input, OnChanges, OnInit} from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit, OnChanges {

  @Input() info_data;

  address = '';
  phone = '';
  price = '';
  rating = null;
  google_page = '';
  website = '';
  hours_msg = '';
  open_hours_list = [];

  week_days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges() {
    // console.log('info changes');
    // console.log(this.info_data);
    if(!this.info_data) return;
    this.address = this.info_data['address'];
    this.phone = this.info_data['phone'];
    for(var i = 0; i < this.info_data['price']; i++) {
      this.price += '$';
    }
    this.rating = this.info_data['rating'];
    this.google_page = this.info_data['google_page'];
    this.website = this.info_data['website'];
    this.buildOpenHours();
  }

  buildOpenHours() {

    if(!this.info_data['hours']) return;
    var utf_offset = this.info_data['utc_offset'];
    if(!utf_offset) {
      utf_offset = -420;
    };
    var current_date = moment().utcOffset(utf_offset).weekday();
    if(current_date < 0) console.error('current date is negative!');
    if(this.info_data['hours']['periods']) {
      this.open_hours_list = this.assembleHoursList(this.info_data['hours']['periods'],
        current_date, this.info_data['hours']['weekday_text']);
    }
    if(this.info_data['hours']['open_now']) {
      this.hours_msg = 'Open now: ';
      var today = this.assembleTime(this.info_data['hours']['periods'][current_date],
        this.info_data['hours']['weekday_text'][(current_date+6)%7]);
      if(today.includes('Closed')) {
        this.hours_msg = 'Closed';
      }
      else {
        this.hours_msg = this.hours_msg + today;
      }
    }
    else {
      this.hours_msg = 'Closed';
    }
    // console.log(this.open_hours_list);
  }

  assembleHoursList(periods, current_date, weekday_text) {
    var list = [];
    for(let i = current_date; i < periods.length || i < weekday_text.length; i++) {
      let weekday_obj = {
        day: '',
        time: ''
      };
      weekday_obj.day = this.week_days[i];
      weekday_obj.time = this.assembleTime(periods[i], weekday_text[(i+6)%7]);
      list.push(weekday_obj);
    }
    for(let i = 0; i < current_date; i++) {
      let weekday_obj = {
        day: '',
        time: ''
      };
      weekday_obj.day = this.week_days[i];
      weekday_obj.time = this.assembleTime(periods[i], weekday_text[(i+6)%7]);
      list.push(weekday_obj);
    }
    return list;
  }

  assembleTime(dataObj, text) {
    if(text && text.trim()) {
      if(text.includes('Open 24 hours')) {
        return 'Open 24 hours';
      }
    }
    return this.formatData(dataObj);
  }

  formatData(dataObj) {
    var data_str = "";
    try {
      var open = dataObj['open']['time'];
      var close = dataObj['close']['time'];
      var data_str = moment(open, "hhmm").format('hh:mm A') + ' - '
        + moment(close, "hhmm").format('hh:mm A');
    }catch (e) {
      console.log("format open hours ", e);
      data_str = "Closed"
    }
    return data_str;
  }

}
