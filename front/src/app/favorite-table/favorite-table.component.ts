import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FavoritesService} from "./favorites.service";

@Component({
  selector: 'app-favorite-table',
  templateUrl: './favorite-table.component.html',
  styleUrls: ['./favorite-table.component.css']
})
export class FavoriteTableComponent implements OnInit, OnChanges {

  @Output() details_query_event = new EventEmitter();
  @Output() switch_to_current_detail = new EventEmitter();
  @Input() current_detail_id;
  current_page_index = 0;
  table_data;

  constructor(private favoriteService: FavoritesService) { }

  ngOnInit() {
    this.favoriteService.arrange_page_data();
    this.table_data = this.favoriteService.getPageData(this.current_page_index);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.favoriteService.arrange_page_data();
  }

  handleDetailsQueryEvent(details_model) {
    this.details_query_event.emit(details_model);
  }

  handleSwitch2CurrentDetail() {
    this.switch_to_current_detail.emit();
  }

  remove_favorite_by_id(placeId) {
    this.favoriteService.removeDataById(placeId);
    this.favoriteService.arrange_page_data();
    this.table_data = this.favoriteService.getPageData(this.current_page_index);
    if(!this.table_data || this.table_data.length == 0) {
      if(this.current_page_index > 0) {
        this.current_page_index = this.current_page_index - 1;
        this.table_data = this.favoriteService.getPageData(this.current_page_index);
      }
    }
  }

  isThereNextPage() {
    return this.current_page_index < this.favoriteService.all_page_data.length - 1;
  }

  isTherePrePage() {
    return this.current_page_index > 0;
  }

  toNextPage() {
    if (this.current_page_index < this.favoriteService.all_page_data.length - 1) {
      this.current_page_index += 1;
    }
    this.favoriteService.arrange_page_data();
    this.table_data = this.favoriteService.getPageData(this.current_page_index);
  }

  toPrePage() {
    if(this.current_page_index > 0) {
      this.current_page_index -= 1;
    }
    this.favoriteService.arrange_page_data();
    this.table_data = this.favoriteService.getPageData(this.current_page_index);
  }

}
