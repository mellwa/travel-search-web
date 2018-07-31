import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FavoriteTableComponent} from "./favorite-table.component";
import {TableModule} from "../table/table.module";
import {FavoritesService} from "./favorites.service";

@NgModule({
  imports: [
    CommonModule,
    TableModule
  ],
  exports: [FavoriteTableComponent],
  declarations: [FavoriteTableComponent],
  providers: [FavoritesService]
})
export class FavoriteTableModule { }
