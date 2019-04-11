import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '../../../../node_modules/@angular/router';
import { ReleaseNotesComponent } from './release-notes.component';
import { NbAuthComponent } from '../../../../node_modules/@nebular/auth';
export const routes: Routes = [
  {
    path: '',
    component: ReleaseNotesComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReleaseNotesRoutingModule { }
