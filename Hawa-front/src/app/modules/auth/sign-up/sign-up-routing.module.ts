import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignUpComponent } from './sign-up.component';
import { SignUpGeneralComponent } from './sign-up-general/sign-up-general.component';
import { SignUpOrganizationComponent } from './sign-up-organization/sign-up-organization.component';
import { SignUpPersonalComponent } from './sign-up-personal/sign-up-personal.component';
import { SignUpSuccessfulNotificationComponent } from './sign-up-successful-notification/sign-up-successful-notification.component';
const routes: Routes = [
  {
    path: '',
    component: SignUpComponent,
    children: [
      { path: '', redirectTo: 'general' },
      { path: 'general', component: SignUpGeneralComponent },
      { path: 'organization', component: SignUpOrganizationComponent },
      { path: 'personal', component: SignUpPersonalComponent },
      { path: 'notification', component: SignUpSuccessfulNotificationComponent },
    ]
  }
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  declarations: []
})
export class SignUpRoutingModule { }
