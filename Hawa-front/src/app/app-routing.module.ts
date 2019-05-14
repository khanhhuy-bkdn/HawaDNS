import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
const routes: Routes = [
  {
    path: 'release-notes',
    loadChildren: 'app/modules/release-notes/release-notes.module#ReleaseNotesModule',
  },
  { path: 'pages', loadChildren: './pages/pages.module#PagesModule' },
  // {
  //   path: 'auth',
  //   loadChildren: './auth/auth.module#NgxAuthModule',
  // },
  {
    path: 'auth',
    loadChildren: 'app/modules/auth/auth.module#NgxAuthModule',
  },

  // {
  //   path: 'auth',
  //   component: AuthComponent,
  //   children: [
  //     { path: 'sign-in', loadChildren: './modules/auth/sign-in/sign-in.module#SignInModule' },
  //     { path: 'sign-up', loadChildren: './modules/auth/sign-up/sign-up.module#SignUpModule' },
  //     { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
  //   ],
  // },

  { path: '', redirectTo: 'pages', pathMatch: 'full' },
  { path: 'not-found', loadChildren: './pages/miscellaneous/miscellaneous.module#MiscellaneousModule'},
  { path: '**', redirectTo: 'not-found' },
];

const config: ExtraOptions = {
  useHash: true,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
