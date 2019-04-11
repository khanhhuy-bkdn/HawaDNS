import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { UserBuyerModel } from '../model/user-buyer/user-buyer.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  public userSubject = new Subject<UserBuyerModel>();
  static observeSession = new Subject<any>();
  constructor(
  ) { }

  // change observeSession
  changeSession() {
    SessionService.observeSession.next();
  }
  // Observable observeSession
  watchSession(): Observable<boolean> {
    return SessionService.observeSession;
  }

  getToken(): String {
    return this.currentSession && `${this.currentSession.tokenType} ${this.currentSession.accessToken}`;
  }

  get currentUser() {
    if (!this.currentSession) {
      return null;
    }
    return {
      userId: this.currentSession.userId,
      employeeId: this.currentSession.employeeId,
      userName: this.currentSession.userName,
      fullName: `${this.currentSession.firstName} ${this.currentSession.lastName}`
    };
  }

  get currentSession() {
    if (!window.localStorage['hawa_tender_session']) {
      return null;
    }

    return JSON.parse(window.localStorage['hawa_tender_session']);
  }

  saveSession(session: any) {
    window.localStorage['hawa_tender_session'] = JSON.stringify(session);
    this.changeSession();
  }

  destroySession() {
    window.localStorage.removeItem('hawa_tender_session');
    window.localStorage.removeItem('HAWA_USER');
    this.changeSession();
  }

  getUserInfo(): Observable<UserBuyerModel> {
    return this.userSubject.asObservable();
  }

  // profileUser(): Observable<UserBuyerModel> {
  //   const url = `user/me`;
  //   return this.apiService.get(url).map(response => {
  //     const result = response.result;
  //     const userCurrent = {
  //       id: result.id,
  //       userName: result.userName,
  //       email: result.email,
  //       type: result.type && {
  //         key: result.type.key,
  //         code: result.type.code,
  //         text: result.type.text
  //       },
  //       organizationName: result.organizationName,
  //       taxNumber: result.taxNumber,
  //       acronymName: result.acronymName,
  //       representative: result.representative,
  //       phone: result.phone,
  //       fax: result.fax,
  //       website: result.website,
  //       houseNumber: result.houseNumber,
  //       address: result.address,
  //       identityCard: result.identityCard,
  //       stateProvince: result.stateProvince && {
  //         key: result.stateProvince.key,
  //         code: result.stateProvince.code,
  //         text: result.stateProvince.text
  //       },
  //       district: result.district && {
  //         key: result.district.key,
  //         code: result.district.code,
  //         text: result.district.text
  //       },
  //       commune: result.commune && {
  //         key: result.commune.key,
  //         code: result.commune.code,
  //         text: result.commune.text
  //       },
  //       avatar: result.avatar && {
  //         guid: result.avatar.guid,
  //         thumbSizeUrl: result.avatar.thumbSizeUrl,
  //         largeSizeUrl: result.avatar.largeSizeUrl,
  //       },
  //       evaluate: result.evaluate, //rating
  //       status: result.status && {
  //         key: result.status.key,
  //         code: result.status.code,
  //         text: result.status.text
  //       }
  //     }
  //     return userCurrent;
  //   });
  // }

}
