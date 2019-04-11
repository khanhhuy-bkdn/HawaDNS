import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInComponent } from './sign-in.component';
import { SignInRoutingModule } from './sign-in-routing.module';
import { SignInGeneralComponent } from './sign-in-general/sign-in-general.component';
import { PopupChooseMethodComponent } from './sign-in-general/popup-choose-method/popup-choose-method.component';
import { ForgotPassComponent } from './forgot-pass/forgot-pass.component';
import { CheckVerificationCodesComponent } from './check-verification-codes/check-verification-codes.component';
import { ChangePassComponent } from './change-pass/change-pass.component';
import { SharedModule } from '../../../shared/shared.module';
import { NotifiChangePassComponent } from './notifi-change-pass/notifi-change-pass.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SignInRoutingModule,
  ],
  declarations: [
    SignInComponent,
    SignInGeneralComponent,
    PopupChooseMethodComponent,
    ForgotPassComponent,
    CheckVerificationCodesComponent,
    ChangePassComponent,
    NotifiChangePassComponent
  ],
  entryComponents: [
    PopupChooseMethodComponent
  ]
})
export class SignInModule { }
