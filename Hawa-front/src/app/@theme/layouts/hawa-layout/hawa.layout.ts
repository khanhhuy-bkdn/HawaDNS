import { Component, OnDestroy, AfterViewInit, HostListener } from '@angular/core';
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
import { ActivatedRoute, Router } from '@angular/router';
import { ManageBuyerService } from '../../../shared/service/manage-user-account/manage-buyer.service';
import { DataGeneralService } from '../../../shared/service/data-general.service';
@Component({
  selector: 'ngx-hawa-layout',
  templateUrl: './hawa.layout.html',
  styleUrls: ['./hawa.layout.scss']
})
export class HawaLayoutComponent implements AfterViewInit, OnDestroy {

  subMenu: NbMenuItem[] = [
    {
      title: 'PAGE LEVEL MENU',
    },
  ];
  layout: any = {};
  sidebar: any = {};
  // haveSession = false;
  isSilderbar = false;
  private alive = true;

  currentTheme: string;
  isShowSubmenu0: boolean = true;
  hideSidebar: boolean = true;
  // subWatchSession: Subscription;
  constructor(protected stateService: StateService,
    protected menuService: NbMenuService,
    protected themeService: NbThemeService,
    protected bpService: NbMediaBreakpointsService,
    protected sidebarService: NbSidebarService,
    protected sessionService: SessionService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private manageBuyerService: ManageBuyerService,
    private dataGeneralService: DataGeneralService
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

    this.userService.getGovernance().subscribe(value => {
      this.isSilderbar = value;
    });

    if (this.router.url.indexOf('infor-search') === -1 && this.router.url.indexOf('infor-user') === -1 )  {
      this.isSilderbar = true;
    } else {
      this.isSilderbar = false;
    }
  }
  ngAfterViewInit() {
    this.checkUrl();
    setTimeout(_ => {
      this.dataGeneralService.followSideMenu().subscribe(value => {
        setTimeout(_ => {
          const widthSidebar = document.getElementById('wrapper-menu-sidebar') ? document.getElementById('wrapper-menu-sidebar').offsetWidth : null;
          if (widthSidebar && widthSidebar < 100) {
            this.hideSidebar = false;
            this.checkUrl();
          } else {
            this.hideSidebar = true;
            this.checkUrl();
          }
        })
      })
    })
  }
  checkUrl() {
    setTimeout(_ => {
      const widthSidebar = document.getElementById('wrapper-menu-sidebar') ? document.getElementById('wrapper-menu-sidebar').offsetWidth : null;
      const url = this.activatedRoute.snapshot['_urlSegment'].segments[1];
      const submenuWrapper = document.getElementsByClassName('admin-submenu')[0] as HTMLElement;
      const submenu = document.getElementsByClassName('submenu')[0] as HTMLUListElement;
      if (url == 'contribute-information') {
        if (submenu) {
          submenu.classList.remove('d-none');
        }
        if (submenuWrapper && submenuWrapper.classList.contains('bg-activeLink')) {
          submenuWrapper.classList.remove('bg-activeLink');
        }
        setTimeout(_ => {
          if (submenuWrapper && widthSidebar && widthSidebar < 100) {
            submenuWrapper.classList.add('bg-activeLink');
          }
          this.isShowSubmenu0 = false;
        })
      } else {
        if (url == 'buyer') {
          // this.manageBuyerService.directToBuyer(true);
        }
        this.isShowSubmenu0 = true;
        if (submenu && submenuWrapper) {
          if (!submenu.classList.contains('d-none')) {
            submenu.classList.add('d-none');
          }
          if (submenuWrapper.classList.contains('bg-activeLink')) {
            submenuWrapper.classList.remove('bg-activeLink');
          }
        }
        if (!submenu && widthSidebar && widthSidebar < 100) {
          if (submenuWrapper && submenuWrapper.classList.contains('bg-activeLink')) {
            submenuWrapper.classList.remove('bg-activeLink');
          }
        }
      }
    }, 1000)
  }

  ngOnDestroy() {
    this.alive = false;
  }
  openSubmenu(indexSubmenu: number) {
    const widthSidebar = document.getElementById('wrapper-menu-sidebar').offsetWidth;
    const submenuWrapper = document.getElementsByClassName('admin-submenu')[indexSubmenu] as HTMLElement;
    const submenu = document.getElementsByClassName('submenu')[indexSubmenu] as HTMLUListElement;
    if (!submenu) {
      if (widthSidebar < 100) {
        return submenuWrapper.classList.add('bg-activeLink');
      }
    } else {
      if (!submenu.classList.contains('d-none')) {
        submenu.classList.add('d-none');
        submenuWrapper.classList.add('bg-activeLink');
        return this.isShowSubmenu0 = true;
      } else {
        submenu.classList.remove('d-none');
        submenuWrapper.classList.remove('bg-activeLink');
        return this.isShowSubmenu0 = false;
      }
    }
  }
}
