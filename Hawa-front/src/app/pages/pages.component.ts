import { Component } from '@angular/core';

import { MENU_ITEMS } from './pages-menu';

@Component({
  // selector: 'ngx-pages',
  // templateUrl: './pages.component.html',
  // styleUrls: ['./pages.component.scss']
  template: `
    <ngx-hawa-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-hawa-layout>
  `,
})
export class PagesComponent {

  menu = MENU_ITEMS;
}
