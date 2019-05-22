import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { NbMenuService, NbSidebarService, NbDialogService } from '@nebular/theme';
// import { UserService } from '../../../@core/data/users.service';
import { AnalyticsService } from '../../../@core/utils/analytics.service';
import { SessionService } from '../../../shared/service/session.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ManageBuyerService } from '../../../shared/service/manage-user-account/manage-buyer.service';
import { Subscription } from 'rxjs';
import { UserService } from '../../../shared/service/user.service';
import { CommingSoonThemComponent } from '../comming-soon-them/comming-soon-them.component';
import { DataGeneralService } from '../../../shared/service/data-general.service';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  @Input() position = 'normal';
  isShowContextMenu: boolean = false;
  isHiddenContextMenu: boolean = false;
  user: any;
  userMenu = [{ title: 'Thông tin người dùng' }, { title: 'Đăng xuất' }];
  haveSession = false;
  admin = false;
  subWatchSession: Subscription;
  isShowTog = false;
  constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private analyticsService: AnalyticsService,
    private sessionService: SessionService,
    private router: Router,
    private manageBuyerService: ManageBuyerService,
    private nbDialogService: NbDialogService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private dataGeneralService: DataGeneralService
  ) {
  }

  ngOnInit() {
    if (this.sessionService.currentSession) {
      this.haveSession = true
      if (this.sessionService.currentSession.role && this.sessionService.currentSession.role === 'Admin') {
        this.admin = true;
      } else {
        this.admin = false;
      }
    }

    this.subWatchSession = this.sessionService.watchSession().subscribe(value => {
      if (this.sessionService.currentSession) {
        this.haveSession = true;
        if (this.sessionService.currentSession.role && this.sessionService.currentSession.role === 'Admin') {
          this.admin = true;
        } else {
          this.admin = false;
        }
      } else {
        this.admin = false;
        this.haveSession = false;
      }
    });
    this.user = JSON.parse(window.localStorage.getItem('HAWA_USER'));
    this.sessionService.getUserInfo().subscribe(user => {
      this.user = user;
    });
    this.menuService.onItemClick().subscribe((event) => {
      this.onItemSelection(event.item.title);
    });
    this.toggleHiddenContextMenu();
    this.userService.getGovernance().subscribe(value => {
      this.isShowTog = value;
    });

    if (this.router.url.indexOf('infor-search') === -1 && this.router.url.indexOf('infor-user') === -1) {
      this.isShowTog = true;
    } else {
      this.isShowTog = false;
    }

    // Click out
    document.addEventListener('click', e => {
      const elem = e.target as HTMLElement;
      if (!elem.matches('#adminmenu') && !elem.matches('#carret-down') && !elem.matches('#adminname') && !elem.matches('#carret-down-icon') && !elem.matches('#adminavatar')) {
        this.isShowContextMenu = false;
      }
    }, false);
  }
  onItemSelection(title) {
    if (title === 'Đăng xuất') {
      this.sessionService.destroySession();
      this.router.navigate(['/pages/infor-search/list']);
    } else if (title === 'Thông tin người dùng') {
      this.manageBuyerService.currentUserInfo().subscribe(currentUser => {
        const currentUserType = currentUser.type;
        if (currentUserType && (currentUserType.code == 'Personal' || currentUserType.key == 'Personal')) {
          this.router.navigate(['/pages/infor-user/personal'])
        }
        if (currentUserType && (currentUserType.code == 'Organization' || currentUserType.key == 'Organization')) {
          this.router.navigate(['/pages/infor-user/organization'])
        }
      })
    }
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.dataGeneralService.toggleValueSideMenu(true);
    return false;
  }

  toggleSettings(): boolean {
    this.sidebarService.toggle(false, 'settings-sidebar');

    return false;
  }
  toggleContextMenu() {
    this.isShowContextMenu = !this.isShowContextMenu;
  }
  routerUserInfo() {
    this.manageBuyerService.currentUserInfo().subscribe(currentUser => {
      this.isShowContextMenu = false;
      const currentUserType = currentUser.type;
      if (currentUserType && (currentUserType.code == 'Personal' || currentUserType.key == 'Personal')) {
        this.router.navigate(['/pages/infor-user/personal'])
      }
      if (currentUserType && (currentUserType.code == 'Organization' || currentUserType.key == 'Organization')) {
        this.router.navigate(['/pages/infor-user/organization'])
      }
    });
    setTimeout(_ => {
      this.toggleHiddenContextMenu();
    }, 500);
  }
  logout() {
    this.isShowContextMenu = false;
    this.sessionService.destroySession();
    this.userService.changeGovernance(false);
    this.router.navigate(['/pages/infor-search/list']);
  }
  toggleHiddenContextMenu() {
    const url = this.activatedRoute.snapshot['_routerState'].url;
    if (url === '/pages/infor-user/personal' || url === '/pages/infor-user/organization') {
      this.isHiddenContextMenu = true;
    } else {
      this.isHiddenContextMenu = false;
    }
  }

  goToHome() {
    this.menuService.navigateHome();
  }

  startSearch() {
    this.analyticsService.trackEvent('startSearch');
  }

  signIn() {
    this.router.navigate(['/auth/sign-in']);
  }

  singUp() {
    this.router.navigate(['/auth/sign-up']);
  }

  ngOnDestroy() {
    this.subWatchSession.unsubscribe();
  }

  homeInforSearch() {
    // if (this.sessionService.currentSession && this.sessionService.currentSession.role && this.sessionService.currentSession.role === 'Admin') {
    //   this.router.navigate(['/pages/account-approval']);
    // } else {
    //   this.router.navigate(['/pages/infor-search/list']);
    // }
    this.userService.changeGovernance(false);
    this.router.navigate(['/pages/infor-search/list']);
    setTimeout(_ => {
      this.toggleHiddenContextMenu();
    }, 500);
  }

  signInComingSoon() {
    this.nbDialogService
      .open(CommingSoonThemComponent, {
        context: {
        }
      })
      .onClose.subscribe();
  }

  governance() {
    this.isShowContextMenu = false;
    this.userService.changeGovernance(true);
    this.router.navigate(['/pages/buyer']);
  }
}
