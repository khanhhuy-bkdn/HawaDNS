import { Component, OnDestroy, OnInit } from '@angular/core';
import { delay, withLatestFrom, takeWhile } from 'rxjs/operators';
import {
  NbMediaBreakpoint,
  NbMediaBreakpointsService,
  NbMenuItem,
  NbMenuService,
  NbSidebarService,
  NbThemeService,
} from '@nebular/theme';

import { StateService } from '../../../@core/data/state.service';
import { SessionService } from '../../../shared/service/session.service';
import { Subscription } from 'rxjs';
import { UserService } from '../../../shared/service/user.service';

// TODO: move layouts into the framework



// <nb-sidebar class="settings-sidebar"
// tag="settings-sidebar"
// state="collapsed"
// fixed
// [end]="sidebar.id !== 'end'">
// <ngx-theme-settings></ngx-theme-settings>
@Component({
  selector: 'ngx-sample-layout',
  styleUrls: ['./sample.layout.scss'],
  template: `
    <nb-layout [center]="layout.id === 'center-column'" windowMode>
      <nb-layout-header fixed>
        <ngx-header [position]="sidebar.id === 'start' ? 'normal': 'inverse'" class="ngx_header__height"></ngx-header>
      </nb-layout-header>

      <nb-sidebar class="menu-sidebar"
                   tag="menu-sidebar"
                   responsive
                   [end]="sidebar.id === 'end'" *ngIf="isSilderbar">
        <nb-sidebar-header>
        </nb-sidebar-header>
        <ng-content select="nb-menu"></ng-content>
      </nb-sidebar>

      <nb-layout-column class="main-content">
        <ng-content select="router-outlet"></ng-content>
      </nb-layout-column>

      <nb-layout-footer fixed>
        <ngx-footer></ngx-footer>
      </nb-layout-footer>

     
    </nb-layout>
  `,
})
export class SampleLayoutComponent implements OnDestroy {

  subMenu: NbMenuItem[] = [
    {
      title: 'PAGE LEVEL MENU',
    },
  ];
  layout: any = {};
  sidebar: any = {};
  // haveSession = false;
  private alive = true;
  isSilderbar = false;
  currentTheme: string;
  subWatchSession: Subscription;
  constructor(protected stateService: StateService,
    protected menuService: NbMenuService,
    protected themeService: NbThemeService,
    protected bpService: NbMediaBreakpointsService,
    protected sidebarService: NbSidebarService,
    protected sessionService: SessionService,
    protected userService: UserService
  ) {
    this.stateService.onLayoutState()
      .pipe(takeWhile(() => this.alive))
      .subscribe((layout: string) => this.layout = layout);

    this.stateService.onSidebarState()
      .pipe(takeWhile(() => this.alive))
      .subscribe((sidebar: string) => {
        this.sidebar = sidebar;
      });

    const isBp = this.bpService.getByName('is');
    this.menuService.onItemSelect()
      .pipe(
        takeWhile(() => this.alive),
        withLatestFrom(this.themeService.onMediaQueryChange()),
        delay(20),
    )
      .subscribe(([item, [bpFrom, bpTo]]: [any, [NbMediaBreakpoint, NbMediaBreakpoint]]) => {

        if (bpTo.width <= isBp.width) {
          this.sidebarService.collapse('menu-sidebar');
        }
      });

    this.themeService.getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe(theme => {
        this.currentTheme = theme.name;
      });

    // if (this.sessionService.currentSession && this.sessionService.currentSession.role && this.sessionService.currentSession.role === 'Admin') {
    //   this.haveSession = true;
    // }

    // this.subWatchSession = this.sessionService.watchSession().subscribe(value => {
    //   if (this.sessionService.currentSession && this.sessionService.currentSession.role && this.sessionService.currentSession.role === 'Admin') {
    //     this.haveSession = true;
    //   } else {
    //     this.haveSession = false;
    //   }
    // });

    this.userService.getGovernance().subscribe( value => {
      this.isSilderbar = value;
    });
    
  }

  ngOnDestroy() {
    this.alive = false;
    this.subWatchSession.unsubscribe();
  }
}
