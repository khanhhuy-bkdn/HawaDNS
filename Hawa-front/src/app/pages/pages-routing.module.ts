import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { AuthGuard } from '../shared/service/auth.guard.service';
import { AuthAdminService } from '../shared/service/auth-admin.service';
const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    { path: '', redirectTo: 'infor-search' },
    { path: 'infor-user', loadChildren: './infor-user/infor-user.module#InforUserModule', canActivate: [AuthGuard] },
    { path: 'infor-search', loadChildren: './infor-search/infor-search.module#InforSearchModule' },
    { path: 'buyer', loadChildren: './manage-user/buyer/buyer.module#BuyerModule', canActivate: [AuthAdminService] },
    // tslint:disable-next-line:max-line-length
    { path: 'contribute-information', loadChildren: './manage-user/contribute-information/contribute-information.module#ContributeInformationModule', canActivate: [AuthAdminService] },
    { path: 'evaluate-contact', loadChildren: './manage-user/evaluate-contact/evaluate-contact.module#EvaluateContactModule', canActivate: [AuthAdminService] },
    { path: 'evaluate-actor', loadChildren: './manage-user/evaluate-actor/evaluate-actor.module#EvaluateActorModule', canActivate: [AuthAdminService] },
    { path: '**', redirectTo: 'not-found' },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
