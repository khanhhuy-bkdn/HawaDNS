import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BuyerComponent } from './buyer.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { InfoComponent } from './info/info.component';

const routes: Routes = [
  {
    path: '',
    component: BuyerComponent,
    children: [
      { path: 'create', component: CreateComponent },
      { path: 'edit/:id', component: EditComponent },
      { path: 'info/:id', component: InfoComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuyerRoutingModule { }
