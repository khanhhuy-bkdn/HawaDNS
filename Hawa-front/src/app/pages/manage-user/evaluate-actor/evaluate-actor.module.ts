import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvaluateActorComponent } from './evaluate-actor.component';
import { EvaluateActorListComponent } from './evaluate-actor-list/evaluate-actor-list.component';
import { SharedModule } from '../../../shared/shared.module';
import { EvaluateActorRoutingModule } from './evaluate-actor-routing.module';
import { EvaluateActorDetailComponent } from './evaluate-actor-detail/evaluate-actor-detail.component';
@NgModule({
  declarations: [
    EvaluateActorComponent,
    EvaluateActorListComponent,
    EvaluateActorDetailComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    EvaluateActorRoutingModule
  ]
})
export class EvaluateActorModule { }
