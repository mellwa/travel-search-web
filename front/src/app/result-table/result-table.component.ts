import {Component, Input, OnInit, OnChanges, Output, EventEmitter} from '@angular/core';
import {DisplayService} from "../display/display.service";
import {ResultTableService} from "./result-table.service";

@Component({
  selector: 'app-result-table',
  templateUrl: './result-table.component.html',
  styleUrls: ['./result-table.component.css']
})
export class ResultTableComponent implements OnInit, OnChanges {

  @Input() data;
  @Input() current_detail_id;
  @Output() details_query_event = new EventEmitter();
  @Output() switch_to_current_detail = new EventEmitter();
  table_data = [];
  current_location = null;
  show_table = false;
  no_record = false;
  next_page_token = '';

  constructor(private result_table_service:ResultTableService) {

  }

  ngOnInit() {

  }

  ngOnChanges() {
    if(!this.data) return;
    this.next_page_token = '';
    this.result_table_service.prev_page_data = [];
    this.result_table_service.table_data = [];
    if(this.data['next_page_token']) {
      this.next_page_token = this.data['next_page_token'];
      this.result_table_service.next_page_token = this.next_page_token;
    }
    if(this.data['results']) {
      this.show_table = true;
      this.table_data = this.data['results'];
    }
    if(this.data['current_location']) {
      this.current_location = this.data['current_location'];
    }
  }

  showPrevBtn() {
    return this.prevPageData().length > 0;
  }

  showNextBtn() {
    if(this.next_page_token.trim()) {
      return true;
    }
    return false;
  }

  ngOnDestroy() {
  }

  toNextPage() {
    var prev = {
      results: this.table_data,
      next_page_token: this.next_page_token
    };
    this.result_table_service.fetchNextPageResult((data) => {
      this.result_table_service.prev_page_data.push(prev);
      this.next_page_token = this.result_table_service.next_page_token;
      this.table_data = data;
      if(!this.table_data || this.table_data.length == 0) {
        this.table_data = ['error'];
      }
    })
  }

  toPrevPage() {
    this.table_data = this.result_table_service.toPrevData();
    this.next_page_token = this.result_table_service.next_page_token;
  }

  prevPageData() {
    return this.result_table_service.prev_page_data;
  }

  handleDetailsQueryEvent(details_model) {
    this.details_query_event.emit(details_model);
  }

  handleSwitch2CurrentDetail() {
    this.switch_to_current_detail.emit();
  }


}
