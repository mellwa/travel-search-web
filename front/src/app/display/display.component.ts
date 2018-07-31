import {
  Component, ComponentFactoryResolver, ElementRef, Input, NgZone, OnChanges, OnInit,
  ViewChild
} from '@angular/core';
import {DisplayService} from "./display.service";
import {NgbTabset} from "@ng-bootstrap/ng-bootstrap";
import {trigger, state, style, animate, transition} from '@angular/animations'
import {el} from "@angular/platform-browser/testing/src/browser_util";

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css'],
  animations: [
    trigger('resultTableState', [
      state('show', style({
        transform: 'translateX(0)'
      })),
      state('off', style({
        transform: 'translateX(200%)'
      })),
      transition('off => show', [
        animate(400, style({transform:'translateX(0)'}))
      ])
    ]),
    trigger('detailState', [
      state('show', style({
        transform: 'translateX(1)'
      })),
      state('off', style({
        transform: 'translateX(-200%)'
      })),
      transition('off => show', [
        animate(400, style({transform:'translateX(0)'}))
      ])
    ])
  ]
})
export class DisplayComponent implements OnInit, OnChanges {

  @Input() data;
  @ViewChild('tabs') tabs:NgbTabset;
  @ViewChild('google_map_section') mapElement: ElementRef;
  show_display = false;
  show_progress_bar = false;
  table_data;
  current_detail_id = '';
  error = false;
  details_data;
  google_service;
  show_details = false;
  destroy_details = false;
  destroy_favorite = false;
  tableState = 'show';
  detailsState = 'off';

  constructor(private service:DisplayService,
              private ngZone: NgZone,
              private componentFactoryResolver: ComponentFactoryResolver) {

  }

  ngOnInit() {

  }

  ngOnDestroy() {
  }

  ngOnChanges() {
    if(!this.data || !this.data['keyword']) {
      return;
    }
    this.service.setMyLocation(this.data['my_location']);
    this.show_progress_bar = true;
    this.show_display = false;
    try {
      this.service.fetchSearchResult(this.data, (result_data) => {
        this.show_progress_bar = false;
        if(result_data == null) {
          this.error = true;
        }
        else {
          this.error = false;
          this.table_data = result_data;
        }
        this.show_display = true;
      });
    } catch (e) {
      console.error(e);
    }
  }

  switchToCurrentDetail() {
    if(!this.show_details) {
      this.show_details = true;
    }
    this.detailsState = 'off';
    this.tableState = 'off';
    setTimeout(()=>{
      this.detailsState = 'show';
    }, 10);
  }

  fetchDetailsAndSwitch(data_model) {
    if(!data_model || !data_model['placeId']) return;
    this.fetchDetails(data_model['placeId']);
  }

  hideDetails() {
    if(this.show_details) {
      this.show_details = false;
    }
    this.detailsState = 'off';
    if(this.tableState == 'show') {
      console.log('table already showed');
      return;
    }
    console.log('hide details');
    this.tableState = 'off';
    this.destroy_favorite = true;
    setTimeout(()=>{
        this.destroy_favorite = false;
        setTimeout(() => {
          this.tableState = 'show';
        }, 10);
    }, 10);
  }

  fetchDetails(place_id) {
    var map = new google.maps.Map(this.mapElement.nativeElement, {
      center: new google.maps.LatLng(34.0223519, -118.285117),
      zoom: 15
    });
    this.google_service = new google.maps.places.PlacesService(map);
    var request = {
      placeId: place_id
    };
    this.destroy_details = true;
    this.show_progress_bar = true;
    this.show_details = true;
    this.detailsState = 'off';
    this.tableState = 'off';
    this.google_service.getDetails(request, (place, status) => {
      if(status == google.maps.places.PlacesServiceStatus.OK) {
        let place_data = Object.assign({}, place);
        this.service.fetchYelpReviewsData(place, (yelp_reviews) => {
          if(place_data) {
            place_data['yelp_reviews'] = yelp_reviews;
          }
          this.ngZone.run(() => {
            // this.table_show_progress_bar = false;
            // this.show_details = true;
            this.details_data = place_data;
            this.destroy_details = false;
            this.current_detail_id = place_id;
            this.show_progress_bar = false;
            setTimeout(()=>{
              this.detailsState = 'show';
            }, 10);
          });
        });
      }
      else {
        //error
        this.error = true;
      }
    });
  }

  handleFavoriteClickById(place_details) {
    if(!place_details && !place_details['place_id']) {
      console.error('place details no data or no place id');
      return;
    }
    let placeId = place_details['place_id'];
    if(this.service.checkIfDataSavedById(placeId)) {
      this.service.removeDataById(placeId);
    }
    else{
      let obj = {};
      obj['index'] = 1;
      obj['category'] = place_details['icon'];
      obj['name'] = place_details['name'];
      obj['address'] = place_details['vicinity'];
      obj['place_id'] = place_details['place_id'];
      obj['location'] = place_details['geometry']['location'];
      this.service.addToFavorite(obj);
    }
  }

  handleTabChangeClick() {
    this.hideDetails();
  }

}
