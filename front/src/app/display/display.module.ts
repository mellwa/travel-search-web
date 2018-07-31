import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DisplayComponent} from "./display.component";
import {ResultTableModule} from "../result-table/result-table.module";
import {FavoriteTableModule} from "../favorite-table/favorite-table.module";
import {DisplayService} from "./display.service";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {MessageModule} from "../message/message.module";
import {MapComponent} from "./details/map/map.component";
import {PhotosComponent} from "./details/photos/photos.component";
import {InfoComponent} from "./details/info/info.component";
import {DetailsComponent} from "./details/details.component";
import {ReviewsComponent} from "./details/reviews/reviews.component";
import {FormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {GooglePlaceModule} from "ngx-google-places-autocomplete";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {AgmCoreModule} from '@agm/core';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ResultTableModule,
    FavoriteTableModule,
    BrowserAnimationsModule,
    GooglePlaceModule,
    MessageModule,
    NgbModule,
    AgmCoreModule
  ],
  declarations: [ DisplayComponent, DetailsComponent, InfoComponent, PhotosComponent, MapComponent, ReviewsComponent ],
  exports: [ DisplayComponent ],
  providers: [DisplayService]
})
export class DisplayModule { }
