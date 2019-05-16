import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EvaluateActorComponent } from './evaluate-actor.component';
import { EvaluateActorListComponent } from './evaluate-actor-list/evaluate-actor-list.component';
import { EvaluateActorDetailComponent } from './evaluate-actor-detail/evaluate-actor-detail.component';
import { EvaluateActorFormComponent } from './evaluate-actor-form/evaluate-actor-form.component';
const routes: Routes = [
  {
    path: '',
    component: EvaluateActorComponent,
    children: [
      { path: '', redirectTo: 'list' },
      { path: 'list', component: EvaluateActorListComponent },
      { path: 'detail/:id', component: EvaluateActorDetailComponent },
      { path: 'form/:id', component: EvaluateActorFormComponent },
    ]
  }
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvaluateActorRoutingModule { }
