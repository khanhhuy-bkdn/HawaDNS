import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { ContributeComponent } from './contribute.component';
import { DetailComponent } from './detail/detail.component';
const routes: Routes = [{
  path: '',
  component: ContributeComponent,
  children: [
    { path: '', redirectTo: 'list' },
    { path: 'list', component: ListComponent },
    { path: 'detail/:communeId', component: DetailComponent }
  ],
}];
@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
})
export class ContributeRoutingModule { }
