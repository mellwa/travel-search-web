import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {ResultTableComponent} from "./result-table/result-table.component";
import {FavoriteTableComponent} from "./favorite-table/favorite-table.component";


// const routes: Routes = [
//   {path: '**', redirectTo: ''},
//   {path: '', component: ResultTableComponent, outlet:"display"},
//   {path: 'favorite-table',
//     component: FavoriteTableComponent,
//     outlet:"display",
//     children: [
//       {path: 'info', component: InfoComponent, outlet:"detail"},
//       {path: 'map', component: MapComponent, outlet:"detail"},
//       {path: 'photos', component: PhotosComponent, outlet:"detail"},
//       {path: 'reviews', component: ReviewsComponent, outlet:"detail"}
//     ]
//   }
// ];
//
// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule]
// })
export class AppRoutingModule { }
