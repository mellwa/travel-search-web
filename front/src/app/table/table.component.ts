import {
  Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
  SimpleChanges, ViewChild, NgZone
} from '@angular/core';
import {trigger, state, style, animate, transition} from '@angular/animations'
import {TableService} from "./table.service";
import {TableConstant} from "./TableConstant";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, OnChanges, OnDestroy {

  @Input() table_data;
  @Input() favorite;
  @Input() current_details_id;
  @Input() show_next_btn;
  @Input() show_prev_btn;
  @Output() prev_event = new EventEmitter();
  @Output() next_event = new EventEmitter();
  @Output() details_query_event = new EventEmitter();
  @Output() switch_to_current_detail = new EventEmitter();
  @Output() remove_favorite_event = new EventEmitter();
  error = false;
  details_model = {
    placeId: 'ChIJVw_lR_TzK4gRo-',
    name: '',
    location: {},
    data: {}
  };

  constructor(private tableService: TableService) {
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('table changed');
    this.error = false;
    if(this.table_data && this.table_data[0] && typeof this.table_data[0] == "string") {
      this.error = true;
    }
  }

  ngOnDestroy() {

  }

  handlePrevClick() {
    this.prev_event.emit();
  }

  handleNextClick() {
    this.next_event.emit();
  }

  showDetails(name, place_id, location) {
    this.details_model.name = name;
    this.details_model.placeId = place_id;
    this.details_model.location = location;
    this.details_query_event.emit(this.details_model);
  }

  showCurrentDetail() {
    this.switch_to_current_detail.emit();
  }

  handleFavoriteClick(data) {
    if(this.ifDataIsFavorite(data)) {
      this.tableService.removeData(data);
    }else {
      this.addToFavorite(data);
    }
  }

  // Favorite table function
  handleFavoriteClickById(placeId) {
    if(this.tableService.checkIfDataSavedById(placeId)) {
      this.tableService.removeDataById(placeId);
    }
    else{
      let data;
      for(var i = 0; i < this.table_data.length; i++) {
        let element = this.table_data[i];
        if(element['place_id'] == placeId) {
          data = element;
        }
      }
      this.addToFavorite(data);
    }
  }

  addToFavorite(data) {
    this.tableService.addToFavorite(data);
  }

  // Favorite table function
  removeFavorite(placeid) {
    this.remove_favorite_event.emit(placeid);
  }

  ifDataIsFavorite(data) {
    return this.tableService.checkIfDataSaved(data);
  }


}
