import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContributeInformationComponent } from './contribute-information.component';
import { PermanentComponent } from './permanent/permanent.component';
const routes: Routes = [{
  path: '',
  component: ContributeInformationComponent,
  children: [
    { path: '', redirectTo: 'contribute' },
    { path: 'contribute', loadChildren: './contribute/contribute.module#ContributeModule' },
    { path: 'permanent', component: PermanentComponent },
  ],
}];
@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContributeInformationRoutingModule { }
