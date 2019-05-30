import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { AuthGuard } from '../shared/service/auth.guard.service';
import { SystemFeedbackComponent } from './manage-user/system-feedback/system-feedback.component';
import { AuthAdminService } from '../shared/service/auth-admin.service';
const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    { path: '', redirectTo: 'dashboard' },
    { path: 'infor-user', loadChildren: './infor-user/infor-user.module#InforUserModule', canActivate: [AuthGuard] },
    { path: 'infor-search', loadChildren: './infor-search/infor-search.module#InforSearchModule' },
    { path: 'dashboard', loadChildren: './manage-user/dashboard/dashboard.module#DashboardModule', canActivate: [AuthAdminService] },
    { path: 'buyer', loadChildren: './manage-user/buyer/buyer.module#BuyerModule', canActivate: [AuthAdminService] },
    { path: 'contribute-information', loadChildren: './manage-user/contribute-information/contribute-information.module#ContributeInformationModule', canActivate: [AuthAdminService] },
    // tslint:disable-next-line:max-line-length
    { path: 'evaluate-contact', loadChildren: './manage-user/evaluate-contact/evaluate-contact.module#EvaluateContactModule', canActivate: [AuthAdminService] },
    { path: 'evaluate-actor', loadChildren: './manage-user/evaluate-actor/evaluate-actor.module#EvaluateActorModule', canActivate: [AuthAdminService] },
    { path: 'setting', loadChildren: './manage-user/setting/setting.module#SettingModule', canActivate: [AuthAdminService] },
    { path: 'feedback', component: SystemFeedbackComponent , canActivate: [AuthAdminService] },
    { path: '**', redirectTo: 'not-found' },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
