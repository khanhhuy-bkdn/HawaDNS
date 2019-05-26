import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InforSearchComponent } from './infor-search.component';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';
const routes: Routes = [
  {
    path: '',
    component: InforSearchComponent,
    children: [
      { path: '', redirectTo: 'list' },
      { path: 'list', component: ListComponent, },
      {
        path: 'detail/:communeID/:treeSpecID', component: DetailComponent,
      },
      {
        path: 'detail/:communeID/:treeSpecID/edit/:id', component: DetailComponent,
      },
    ],
  },
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  declarations: [],
})
export class InforSearchRoutingModule { }
