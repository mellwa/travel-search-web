import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {FormService} from "./form.service";
import {Form} from "./form";
import {Category} from "./category";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent {
  here = 'Current location';
  place = 'Other. Please specify:';
  distance = '';
  form = new Form();
  location_input_disabled = true;
  radio_here = true;
  category = new Category();
  specified_location = '';
  @ViewChild('searchForm') myForm;
  @ViewChild('category_select') categorySelect;
  fetchingData = false;
  currentLocation = {lat: 34.02177, lon: -118.28538};
  @Output() sendData = new EventEmitter();
  @Output() clear = new EventEmitter();



  constructor(private service:FormService) {
    this.fetchCurrentLocation();
  }

  ngOnInit():void {
    this.init();
  }

  fetchCurrentLocation() {
    this.fetchingData = true;
    this.service.fetchCurrentLocation()
      .subscribe((data) => {
      this.fetchingData = false;
      if (data && data['lat'] && data['lon']) {
        this.currentLocation.lat = parseFloat(data['lat']);
        this.currentLocation.lon = parseFloat(data['lon']);
        this.form.my_location['lat'] = parseFloat(data['lat']);
        this.form.my_location['lng'] = parseFloat(data['lon']);
      }
    });
  }

  init() {
    this.selectCurrentLocation();
    this.form.category = 'Default';
  }

  formSubmit() {
    this.assembleForm();
    this.sendData.emit(this.form);
  }

  clearForm() {
    this.myForm.reset({'category': 'Default'});
    this.init();
    this.clear.emit();
  }

  setLocationInputDisabled(status:boolean) {
    this.location_input_disabled = status;
  }

  locationInputStatus() {
    return this.location_input_disabled;
  }

  selectCurrentLocation() {
    this.radio_here = true;
    this.specified_location = '';
    this.setLocationInputDisabled(true);
  }

  selectSpecifyLocation() {
    this.radio_here = false;
    this.setLocationInputDisabled(false);
  }

  handleAddressChange(event) {
    if(event && event.formatted_address) {
      this.specified_location = event.formatted_address;
    }
  }

  assembleForm() {
    if(this.radio_here) {
      this.form.lat = this.currentLocation.lat;
      this.form.lon = this.currentLocation.lon;
      this.form.address = '';
    }
    else {
      this.form.lat = null;
      this.form.lon = null;
      this.form.address = this.specified_location;
    }
    if(!this.distance) {
      this.form.distance = '10';
    }
    else {
      this.form.distance = this.distance;
    }
  }

}

