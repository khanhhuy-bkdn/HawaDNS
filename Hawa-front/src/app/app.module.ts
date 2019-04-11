/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { APP_BASE_HREF } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule} from '@angular/common/http';
import { CoreModule } from './@core/core.module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ThemeModule } from './@theme/theme.module';
import { NgbModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NbThemeModule } from '@nebular/theme';
import { AlertComponent } from './shared/shared-components/alert/alert.component';
import { UserService } from './shared/service/user.service';
import { ApiService } from './shared/service/api.service';
import { HttpModule } from '@angular/http';
import { AuthGuard } from './shared/service/auth.guard.service';
import { InstantSearchService } from './shared/service/instant-search.service';
import { ConfirmationService } from './shared/service/confirmation.service';
import { GMapsService } from './shared/service/google-map.service';
import { ToastyModule } from 'ng2-toasty';


@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    HttpModule,
    NgbDropdownModule.forRoot(),
    NgbModule.forRoot(),
    ThemeModule.forRoot(),
    NbThemeModule.forRoot({ name: 'default' }),
    CoreModule.forRoot(),
    ToastyModule.forRoot()
  ],
  bootstrap: [AppComponent],
  providers: [
    AuthGuard,
    UserService,
    ApiService,
    InstantSearchService,
    GMapsService,
    ConfirmationService,
    { provide: APP_BASE_HREF, useValue: '/' },
  ],
})
export class AppModule {
}
