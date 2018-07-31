import {
  Component, ElementRef, EventEmitter, Input, NgZone, OnChanges, OnDestroy, OnInit, Output,
  ViewChild
} from '@angular/core';
import {trigger, state, style, animate, transition} from '@angular/animations';
import {} from '@types/googlemaps'
import {ArrayType} from "@angular/compiler/src/output/output_ast";
import {DisplayService} from "../display.service";

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit, OnDestroy, OnChanges {

  @Input() details_data;
  place_id;
  name;
  @Input() latlng_location;
  @Output() hide_details = new EventEmitter();
  @Output() favorite_choose = new EventEmitter();
  @ViewChild('google_map_section') mapElement: ElementRef;

  twitter_icon_url = "http://cs-server.usc.edu:45678/hw/hw8/images/Twitter.png";

  model = {
    info_data: {},
    photos_data: [],
    map_data: {},
    reviews_data: {}
  };
  disabled = false;

  constructor(private ngZone:NgZone,
              private displayService:DisplayService) {

  }

  ngOnInit() {
    // console.log('details init and place id is',this.place_id);
  }

  ngOnDestroy() {
    // console.log('details destroy');
  }

  hideDetails() {
    this.hide_details.emit();
  }

  ngOnChanges() {
    if(!this.details_data) return;
    this.name = this.details_data['name'];
    this.place_id = this.details_data['place_id'];
    this.assignInfoData();
    this.assignPhotos();
    this.assignLocationData();
    this.assignReviewsData();
  }

  assignInfoData() {
    var data = {};
    data['address'] = this.details_data['formatted_address'];
    data['phone'] = this.details_data['international_phone_number'];
    data['price'] = this.details_data['price_level'];
    data['rating'] = this.details_data['rating'];
    data['google_page'] = this.details_data['url'];
    data['website'] = this.details_data['website'];
    data['hours'] = this.details_data['opening_hours'];
    data['utc_offset'] = this.details_data['utc_offset'];
    this.model.info_data = data;
  }

  assignPhotos() {
    if(!this.details_data['photos']) return;
    var photos = [];
    for(var i = 0; i < this.details_data['photos'].length; i++) {
      var width = this.details_data['photos'][i]['width'];
      width = width ? width : 1000;
      var height = this.details_data['photos'][i]['height'];
      height = height ? height : 1000;
      photos.push(this.details_data['photos'][i].getUrl({'maxWidth': width, 'maxHeight': height}));
    }
    // console.log(photos);
    this.model.photos_data = photos;
  }

  assignLocationData() {
    // console.log('*********Location**********');
    // console.log(this.details_data);
    var data = {};
    data['address'] = this.details_data['name']+', '+this.details_data['formatted_address'];
    if(this.details_data['geometry'] && this.details_data['geometry']['location']) {
      try {
        var location = {
          lat: this.details_data['geometry']['location']['lat'](),
          lng: this.details_data['geometry']['location']['lng']()
        };
        data['location'] = location;
      }
      catch (e) {
        console.error(e);
      }
    }
    this.model.map_data = data;
  }

  assignReviewsData() {
    this.model.reviews_data = {};
    if (this.details_data['reviews']) {
      this.model.reviews_data['google'] = this.details_data['reviews'];
    }
    if(this.details_data['yelp_reviews']) {
      this.model.reviews_data['yelp'] = this.details_data['yelp_reviews'];
    }
  }

  favoriteButtonHandler() {
    this.favorite_choose.emit(this.details_data);
  }

  isFavorite() {
    return this.displayService.checkIfDataSavedById(this.place_id);
  }

  twitterEvent() {
    let name = this.name ? this.name : '';
    let address = this.model.info_data['address'] ? this.model.info_data['address'] : '';
    let website = this.model.info_data['website'] ? this.model.info_data['website'] : '';
    var ref = "https://twitter.com/intent/tweet?text=Check out "
      + name + " located at "
      + address + '. Website:&url='
      + website + '&hashtags=TravelAndEntertainmentSearch';
    return ref;
  }

}
