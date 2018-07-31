import {Component, ElementRef, Input, NgZone, OnChanges, OnDestroy, OnInit, ViewChild} from '@angular/core';
import MarkerOptions = google.maps.MarkerOptions;
import {DisplayService} from "../../display.service";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnChanges, OnDestroy {

  pegman_url = "http://cs-server.usc.edu:45678/hw/hw8/images/Pegman.png";
  map_url = "http://cs-server.usc.edu:45678/hw/hw8/images/Map.png";

  @ViewChild('google_map_display') mapElement: ElementRef;
  @ViewChild('routes_details') routesPanel:ElementRef;
  @Input() input_model;

  travel_modes = ['DRIVING', 'BICYCLING', 'TRANSIT', 'WALKING'];
  map_model = {
    current_travel_mode: this.travel_modes[0],
    from: '',
    to: '',
    show_routes: false,
    get_direction_btn_disabled: false
  };

  from;

  destination;

  street_view = {
    showStreet: false,
    url: this.pegman_url
  };

  map;
  google_map_marker;
  directionService;
  directionDisplay;

  constructor(private ngZone:NgZone,
              private displaceService:DisplayService) {
  }

  ngOnInit() {
  }

  ngOnChanges() {
    if(!this.input_model || !this.input_model['location']) return;
    this.destination = this.input_model['location'];
    this.map_model.to = this.input_model['address'];
    this.map_model.from = this.displaceService.current_address ? this.displaceService.current_address : 'Your Location';
    this.from = this.displaceService.current_location;
    this.showMapView();
  }

  ngOnDestroy() {

  }

  getDirections() {
    this.map_model.show_routes = true;
    this.map_model.get_direction_btn_disabled = true;
    this.calculateRoute();
  }

  showMapView() {
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      center: new google.maps.LatLng(this.destination.lat, this.destination.lng),
      zoom: 15
    });
    this.google_map_marker = new google.maps.Marker({
      position: {
        lat: this.destination.lat,
        lng: this.destination.lng
      },
      map: this.map
    });
    this.directionService = new google.maps.DirectionsService();
    this.directionDisplay = new google.maps.DirectionsRenderer();
    this.directionDisplay.setMap(this.map);
    this.directionDisplay.setPanel(this.routesPanel.nativeElement);
  }

  calculateRoute() {
    // console.log('my location ',this.from, ' from ', this.map_model.from);
    let origin = null;
    if(!this.map_model.from || !this.map_model.from.trim()) {
      this.map_model.from = 'Your Location';
    }
    if(this.map_model.from.trim().toLowerCase() == "your location"
      || this.map_model.from.trim().toLowerCase() == 'my location') {
      origin = this.displaceService.getMyLocation();
    }
    else if(this.map_model.from == this.displaceService.current_address) {
      origin = this.displaceService.current_location;
    }
    else {
      origin = this.map_model.from
    }
    this.directionService.route({
      origin: origin,
      destination: this.map_model.to,
      travelMode: google.maps.TravelMode[this.map_model.current_travel_mode],
      provideRouteAlternatives: true
    }, (response, status) => {
      if(status == google.maps.DirectionsStatus.OK) {
        this.google_map_marker.setMap(null);
        this.directionDisplay.setDirections(response);
      }
      else {
        console.error('google maps directions request failed due to ' + status);
      }
      this.ngZone.run(() => {
        this.map_model.get_direction_btn_disabled = false;
      });
    });
  }

  showStreetView() {
    var panoram = new google.maps.StreetViewPanorama(this.mapElement.nativeElement, {
      position: {
        lat: this.destination.lat,
        lng: this.destination.lng
      },
      pov: {
        heading: 34,
        pitch: 10
      }
    });
    this.map.setStreetView(panoram);
    this.directionDisplay.setPanel(null);
  }

  streetViewBtnHandler() {
    if(this.street_view.showStreet) {
      this.street_view.showStreet = false;
      this.street_view.url = this.pegman_url;
      this.showMapView();
    }else {
      this.street_view.showStreet = true;
      this.street_view.url = this.map_url;
      this.showStreetView();
    }
  }

  handleAddressChange(event) {
    if(event && event.formatted_address) {
      this.map_model.from = event.formatted_address;
    }
  }

  handleInputChange(value) {
    this.map_model.from = value.trim();
    if(!this.map_model.from) {
      this.map_model.get_direction_btn_disabled = true;
    }
    else{
      this.map_model.get_direction_btn_disabled = false;
    }
  }

}
