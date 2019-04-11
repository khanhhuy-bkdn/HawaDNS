import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { ApiService } from './api.service';
import { SessionService } from './session.service';
import { UserBuyerModel } from '../model/user-buyer/user-buyer.model';

@Injectable()
export class UserService {
    private localStorage = window.localStorage;
    public governance = new Subject<boolean>();
    constructor(
        private apiService: ApiService,
        private sessionService: SessionService,
    ) { }
    get employeeId() {
        return this.sessionService.currentUser.userId;
    }

    get getUserId() {
        return this.sessionService.currentUser.userId;

    }

    // private static toUserModel(result: any): UserModel {
    //     return {
    //         id: result.id,
    //         userName: result.userName,
    //         employeeId: result.employeeId,
    //         fullName: result.fullName,
    //         dateOfBirth: result.dateOfBirth,
    //         gender: result.gender,
    //         phoneNumber: result.phoneNumber,
    //         avatarUrl: result.avatarUrl,
    //         email: result.email,
    //         address: result.address,
    //         role: result.role,
    //         isActive: result.isActive,
    //         lastName: result.lastName,
    //         firstName: result.firstName,
    //         department: result.department && {
    //             id: result.department.key,
    //             text: result.department.value,
    //         },
    //         level: result.level && {
    //             id: result.level.key,
    //             text: result.level.value
    //         },
    //         userGroup: result.userGroup && {
    //             id: result.userGroup.key,
    //             text: result.userGroup.value
    //         },
    //         avatar: result.avatar,
    //         privileges: result.privileges.map(x => x.value)
    //     };
    // }

    setAuth(session: any) {
        this.sessionService.saveSession(session);
        this.profileUser().subscribe(userCurrent => {
            window.localStorage.setItem('HAWA_USER', JSON.stringify(userCurrent));
            this.sessionService.userSubject.next(userCurrent);
        });
    }


    profileUser(): Observable<UserBuyerModel> {
        const url = `user/me`;
        return this.apiService.get(url).map(response => {
            const result = response.result;
            const userCurrent = {
                id: result.id,
                userName: result.userName,
                email: result.email,
                type: result.type && {
                    key: result.type.key,
                    code: result.type.code,
                    text: result.type.text
                },
                organizationName: result.organizationName,
                taxNumber: result.taxNumber,
                acronymName: result.acronymName,
                representative: result.representative,
                phone: result.phone,
                fax: result.fax,
                website: result.website,
                houseNumber: result.houseNumber,
                address: result.address,
                identityCard: result.identityCard,
                stateProvince: result.stateProvince && {
                    key: result.stateProvince.key,
                    code: result.stateProvince.code,
                    text: result.stateProvince.text
                },
                district: result.district && {
                    key: result.district.key,
                    code: result.district.code,
                    text: result.district.text
                },
                commune: result.commune && {
                    key: result.commune.key,
                    code: result.commune.code,
                    text: result.commune.text
                },
                avatar: result.avatar && {
                    guid: result.avatar.guid,
                    thumbSizeUrl: result.avatar.thumbSizeUrl,
                    largeSizeUrl: result.avatar.largeSizeUrl,
                },
                evaluate: result.evaluate, //rating
                status: result.status && {
                    key: result.status.key,
                    code: result.status.code,
                    text: result.status.text
                }
            }
            return userCurrent;
        });
    }


    purgeAuth() {
        this.sessionService.destroySession();
    }

    attemptAuth(type, username, password): Observable<any> {
        const route = type === 'loginweb' ? 'loginweb' : '';
        return this.apiService
            .postAuth(route, {
                userNameOrEmailAddress: username,
                password: password
            })
            .map(data => {
                this.setAuth(data.result);
                return data.result;
            });
    }

    changePassword(
        oldPassword: string,
        newPassword: string
    ): Observable<any> {
        return this.apiService
            .post('/user/password/change', {
                currentPassword: oldPassword,
                newPassword: newPassword
            })
            .map(data => {
                return data;
            });
    }

    getActiveCode(email: string): Observable<any> {
        const url = `password/forgot`;
        return this.apiService
            .post(url, {
                email: email
            })
            .map(data => {
                return data.result;
            });
    }

    validateActiveCode(email: string, token: string): Observable<any> {
        const url = `password/validateactivecode`;
        // ${recoverCode}
        return this.apiService.post(url, {
            email: email,
            token: token
        }).map(data => {
            return data.result;
        });
    }

    resetPassword(email: string, recoverCode: string, newPassword: string): Observable<any> {
        const url = `password/reset`;
        return this.apiService
            .post(url, {
                email: email,
                token: recoverCode,
                password: newPassword
            })
            .map(data => {
                return data.result;
            });
    }

    logOut(): Observable<any> {
        return this.apiService.post('/logout').map(data => {
            return data;
        });
    }

    /////////////////////////////////////////////////

    accountVerify(email: string, activeToken: string) {
        const url = `account/verify`;
        const modelRequest = {
            email: email,
            activeToken: activeToken
        }
        return this.apiService.post(url, modelRequest);
    }
    resendEmail(email: string): Observable<any> {
        const url = `account/sendactivecode?email=${email}`;
        return this.apiService.get(url).map(res => res)
    }

    // Check email tạo user
    checkexistemail(email: string) {
        const url = `user/checkexistemail`;
        const requestModel = {
            email: email,
        }
        return this.apiService.post(url, requestModel).map(response => response.result);
    }

    // 
    getGovernance(): Observable<boolean> {
        return this.governance.asObservable();
    }

    changeGovernance(isShow) {
        this.governance.next(isShow);
    }

}
