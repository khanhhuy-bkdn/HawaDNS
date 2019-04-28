import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    { path: '', redirectTo: 'infor-search' },
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
