import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NbAuthComponent } from '@nebular/auth';

export const routes: Routes = [
  {
    path: '',
    component: NbAuthComponent,
    children: [
      { path: 'sign-in', loadChildren: './sign-in/sign-in.module#SignInModule' },
      { path: 'sign-up', loadChildren: './sign-up/sign-up.module#SignUpModule' },
      { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NgxAuthRoutingModule  {
}
