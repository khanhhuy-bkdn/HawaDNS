import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-miscellaneous',
  template: `
    <router-outlet></router-outlet>
    <nb-layout></nb-layout>
  `,
})
export class MiscellaneousComponent implements OnInit {
  ngOnInit() {
  }
}
