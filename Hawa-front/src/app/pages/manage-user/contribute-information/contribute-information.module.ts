import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermanentComponent } from './permanent/permanent.component';
import { ContributeInformationComponent } from './contribute-information.component';
import { SharedModule } from '../../../shared/shared.module';
import { ContributeInformationRoutingModule } from './contribute-information-routing.module';
import { PopupContributeComponent } from './component/popup-contribute/popup-contribute.component';

@NgModule({
  declarations: [
    PermanentComponent,
    ContributeInformationComponent,
    PopupContributeComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ContributeInformationRoutingModule
  ],
  entryComponents: [
    PopupContributeComponent
  ]
})
export class ContributeInformationModule { }
