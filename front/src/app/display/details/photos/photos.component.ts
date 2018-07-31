import {Component, Input, OnChanges, OnInit} from '@angular/core';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.css']
})
export class PhotosComponent implements OnInit, OnChanges {

  @Input() photos;

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges() {
    // console.log(this.photos);
  }

}
