import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BuyerRoutingModule } from './buyer-routing.module';
import { BuyerComponent } from './buyer.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { InfoComponent } from './info/info.component';
import { SharedModule } from '../../../shared/shared.module';
import { PersonalComponent } from './component/personal/personal.component';
import { OrganizationComponent } from './component/organization/organization.component';

@NgModule({
  declarations: [
    BuyerComponent,
    CreateComponent,
    EditComponent,
    InfoComponent,
    PersonalComponent,
    OrganizationComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    BuyerRoutingModule
  ],
  entryComponents: [
  ]
})
export class BuyerModule { }
