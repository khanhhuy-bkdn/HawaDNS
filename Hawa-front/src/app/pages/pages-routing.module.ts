import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { AuthGuard } from '../shared/service/auth.guard.service';
const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    { path: '', redirectTo: 'infor-search' },
    { path: 'infor-user', loadChildren: './infor-user/infor-user.module#InforUserModule', canActivate: [AuthGuard] },
    { path: 'infor-search', loadChildren: './infor-search/infor-search.module#InforSearchModule' },
    { path: '**', redirectTo: 'not-found' },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
