import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvaluateContactComponent } from './evaluate-contact.component';
import { SharedModule } from '../../../shared/shared.module';
import { EvaluateContactRoutingModule } from './evaluate-contact-routing.module';
import { EvaluateContactListComponent } from './evaluate-contact-list/evaluate-contact-list.component';
import { EvaluateContactDetailComponent } from './evaluate-contact-detail/evaluate-contact-detail.component';
@NgModule({
  declarations: [
    EvaluateContactComponent,
    EvaluateContactListComponent,
    EvaluateContactDetailComponent 
  ],
  imports: [
    CommonModule,
    SharedModule,
    EvaluateContactRoutingModule
  ]
})
export class EvaluateContactModule { }
