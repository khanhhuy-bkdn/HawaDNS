import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { PagesRoutingModule } from './pages-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { SharedModule } from '../shared/shared.module';
import { SystemFeedbackComponent } from './manage-user/system-feedback/system-feedback.component';

const PAGES_COMPONENTS = [
  PagesComponent,
];

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    DashboardModule,
    MiscellaneousModule,
    SharedModule
  ],
  declarations: [
    ...PAGES_COMPONENTS,
    SystemFeedbackComponent,
  ],
})
export class PagesModule {
}
