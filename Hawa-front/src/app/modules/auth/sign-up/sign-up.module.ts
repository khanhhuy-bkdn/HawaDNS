import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignUpComponent } from './sign-up.component';
import { SignUpGeneralComponent } from './sign-up-general/sign-up-general.component';
import { SignUpRoutingModule } from './sign-up-routing.module';
import { SignUpOrganizationComponent } from './sign-up-organization/sign-up-organization.component';
import { SignUpPersonalComponent } from './sign-up-personal/sign-up-personal.component';
import { SignUpSuccessfulNotificationComponent } from './sign-up-successful-notification/sign-up-successful-notification.component';
import { SharedModule } from '../../../shared/shared.module';
import { NotifiSignedUpComponent } from './notifi-signed-up/notifi-signed-up.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SignUpRoutingModule
  ],
  declarations: [
    SignUpComponent,
    SignUpGeneralComponent,
    SignUpOrganizationComponent,
    SignUpPersonalComponent,
    SignUpSuccessfulNotificationComponent,
    NotifiSignedUpComponent
  ],
  entryComponents: [
    NotifiSignedUpComponent
  ]
})
export class SignUpModule { }
