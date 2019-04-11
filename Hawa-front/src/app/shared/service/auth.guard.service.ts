import { Injectable } from "@angular/core";
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from "@angular/router";
import { Router } from "@angular/router";
import { SessionService } from "./session.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private sessionService: SessionService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (!this.sessionService.currentSession) {
            this.router.navigate(['/not-found/404']);
            return false;
        }
        if (this.sessionService.currentSession) {
            return true;
        }
    }
}
