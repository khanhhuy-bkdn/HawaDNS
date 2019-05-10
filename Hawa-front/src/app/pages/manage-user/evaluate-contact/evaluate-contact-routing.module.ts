import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EvaluateContactComponent } from './evaluate-contact.component';
import { EvaluateContactListComponent } from './evaluate-contact-list/evaluate-contact-list.component';
import { EvaluateContactDetailComponent } from './evaluate-contact-detail/evaluate-contact-detail.component';
const routes: Routes = [
  {
    path: '',
    component: EvaluateContactComponent,
    children: [
      { path: '', redirectTo: 'list' },
      { path: 'list', component: EvaluateContactListComponent },
      { path: 'detail/:id', component: EvaluateContactDetailComponent },
    ]
  }
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvaluateContactRoutingModule { }
