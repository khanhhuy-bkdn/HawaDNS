import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InforUserComponent } from './infor-user.component';
import { InforUserRoutingModule } from './infor-user-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { OrganizationInfoComponent } from './organization-info/organization-info.component';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    InforUserRoutingModule,
  ],
  declarations: [
    InforUserComponent,
    PersonalInfoComponent,
    OrganizationInfoComponent
  ]
})
export class InforUserModule { }
