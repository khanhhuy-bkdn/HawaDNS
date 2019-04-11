import { NgModule } from '@angular/core';
import { SignInGeneralComponent } from './sign-in-general/sign-in-general.component';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './sign-in.component';
import { ForgotPassComponent } from './forgot-pass/forgot-pass.component';
import { CheckVerificationCodesComponent } from './check-verification-codes/check-verification-codes.component';
import { ChangePassComponent } from './change-pass/change-pass.component';
import { NotifiChangePassComponent } from './notifi-change-pass/notifi-change-pass.component';

const routes: Routes = [
  {
    path: '',
    component: SignInComponent,
    children: [
      { path: '', redirectTo: 'general' },
      { path: 'general', component: SignInGeneralComponent },
      { path: 'forgot-pass', component: ForgotPassComponent },
      { path: 'verification', component: CheckVerificationCodesComponent },
      { path: 'change-pass', component: ChangePassComponent },
      { path: 'notifi-success-change-pass', component: NotifiChangePassComponent },
    ],
  },
];
@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  declarations: [],
})
export class SignInRoutingModule { }
