import { NgModule } from '@angular/core';
import { InforUserComponent } from './infor-user.component';
import { RouterModule, Routes } from '@angular/router';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { OrganizationInfoComponent } from './organization-info/organization-info.component';
const routes: Routes = [
  {
    path: '',
    component: InforUserComponent,
    children: [
      { path: '', redirectTo: 'organization' },
      { path: 'organization', component: OrganizationInfoComponent },
      { path: 'personal', component: PersonalInfoComponent }
    ]
  }
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  declarations: []
})
export class InforUserRoutingModule { }
