import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '../../../../node_modules/@angular/router';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class AuthAdminService {

  constructor(
    private router: Router,
        private sessionService: SessionService
  ) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if ( !(this.sessionService.currentSession && this.sessionService.currentSession.role && this.sessionService.currentSession.role === 'Admin') ) {
        this.router.navigate(['/not-found/404']);
        return false;
    }
    if (this.sessionService.currentSession) {
        return true;
    }
}
}
