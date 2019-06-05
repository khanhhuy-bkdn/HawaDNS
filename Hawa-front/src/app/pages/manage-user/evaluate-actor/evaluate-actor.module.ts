import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvaluateActorComponent } from './evaluate-actor.component';
import { EvaluateActorListComponent } from './evaluate-actor-list/evaluate-actor-list.component';
import { SharedModule } from '../../../shared/shared.module';
import { EvaluateActorRoutingModule } from './evaluate-actor-routing.module';
import { EvaluateActorDetailComponent } from './evaluate-actor-detail/evaluate-actor-detail.component';
import { EvaluateActorFormComponent } from './evaluate-actor-form/evaluate-actor-form.component';
import { EvaluateActorFormCreateComponent } from './evaluate-actor-form-create/evaluate-actor-form-create.component';
import { EvaluateActorListActorComponent } from './evaluate-actor-list-actor/evaluate-actor-list-actor.component';
@NgModule({
  declarations: [
    EvaluateActorComponent,
    EvaluateActorListComponent,
    EvaluateActorDetailComponent,
    EvaluateActorFormComponent,
    EvaluateActorFormCreateComponent,
    EvaluateActorListActorComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    EvaluateActorRoutingModule
  ]
})
export class EvaluateActorModule { }
