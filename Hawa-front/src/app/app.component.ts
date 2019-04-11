/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from './@core/utils/analytics.service';
import * as moment from 'moment';
@Component({
  selector: 'ngx-app',
  template: `<router-outlet></router-outlet><app-alert></app-alert><ng2-toasty></ng2-toasty>`,
})
export class AppComponent implements OnInit {

  constructor(
    private analytics: AnalyticsService) {
    moment.locale('vi');
  }

  ngOnInit() {
    this.analytics.trackPageViews();
  }
}
