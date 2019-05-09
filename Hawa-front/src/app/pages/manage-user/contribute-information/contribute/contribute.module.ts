import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { SharedModule } from '../../../../shared/shared.module';
import { ContributeRoutingModule } from './contribute-routing.module';
import { ContributeComponent } from './contribute.component';
import { DetailComponent } from './detail/detail.component';

@NgModule({
  declarations: [
    ListComponent,
    ContributeComponent,
    DetailComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ContributeRoutingModule
  ]
})
export class ContributeModule { }
