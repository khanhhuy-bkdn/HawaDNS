import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { PagedResult } from '../../model/dictionary/paging-result.model';
import { UserBuyerFilter } from '../../model/user-buyer/user-buyer-filter.model';
import { UserBuyerItem } from '../../model/user-buyer/user-buyer-item.model';
import { URLSearchParams } from '@angular/http';
import { CreateUserBuyer } from '../../model/user-buyer/create-user-buyer.model';
import { InstantSearchService } from '../instant-search.service';
import { UserBuyerModel } from '../../model/user-buyer/user-buyer.model';
import { ForestPlotItem } from '../../model/contribute-information/forest-plot-item.model';

const STORAGE_KEY = 'HAWA_USER';
@Injectable({
  providedIn: 'root'
})
export class ManageBuyerService {
  private static redirectToBuyer = new BehaviorSubject<boolean>(false);
  private localStorage = window.localStorage;
  valueFormCreateBuyer;
  constructor(
    private apiService: ApiService,
    private instantSearchService: InstantSearchService
  ) { }
  followDirectToBuyer() {
    return ManageBuyerService.redirectToBuyer;
  }
  directToBuyer(value) {
    ManageBuyerService.redirectToBuyer.next(value);
  }
  private static createUserFilterParams(filter: UserBuyerFilter): URLSearchParams {
    const urlFilterParams = new URLSearchParams();
    urlFilterParams.append('type', filter.type);
    urlFilterParams.append('stateProvinceID', filter.stateProvinceID.toString());
    urlFilterParams.append('districtID', filter.districtID.toString());
    urlFilterParams.append('communeID', filter.communeID.toString());
    urlFilterParams.append('status', filter.status);
    urlFilterParams.append('sorting', filter.sorting);
    return urlFilterParams;
  }

  private static toUserBuyerItem(result: any): UserBuyerItem {
    return {
      id: result.id,
      email: result.email,
      type: result.type && {
        key: result.type.key,
        code: result.type.code,
        text: result.type.text
      },
      organizationName: result.organizationName,
      acronymName: result.acronymName,
      phone: result.phone,
      homePhone: result.homePhone && result.homePhone,
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
        text: result.commune.text,
      },
      status: result.status && {
        key: result.status.key,
        code: result.status.code,
        text: result.status.text,
      },
      checked: false,
    }
  }

  currentUserInfo(): Observable<UserBuyerModel> {
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
      this.localStorage.removeItem(STORAGE_KEY);
      this.localStorage.setItem(STORAGE_KEY, JSON.stringify(userCurrent));
      return userCurrent;
    });
  }


  createUser(modelUser): Observable<any> {
    const url = `user/create`;
    const infoUser = {
      email: modelUser.email ? String(modelUser.email) : '',
      type: modelUser.typeuser ? String(modelUser.typeuser) : '',
      organizationName: modelUser.name ? String(modelUser.name) : '',
      taxNumber: modelUser.taxnumber ? String(modelUser.taxnumber) : '',
      acronymName: modelUser.acronym ? String(modelUser.acronym) : '',
      representative: modelUser.representative ? String(modelUser.representative) : '',
      phone: modelUser.phone ? String(modelUser.phone) : '',
      fax: modelUser.fax ? String(modelUser.fax) : '',
      website: modelUser.website ? String(modelUser.website) : '',
      stateProvinceID: modelUser.province ? +modelUser.province : '',
      districtID: modelUser.district ? +modelUser.district : '',
      communeID: modelUser.ward ? +modelUser.ward : '',
      houseNumber: modelUser.home ? String(modelUser.home) : '',
      address: modelUser.fulladdress ? String(modelUser.fulladdress) : '',
      identityCard: modelUser.identification ? String(modelUser.identification) : '',
      avatar: modelUser.profilePic ? String(modelUser.profilePic) : '',
      evaluate: modelUser.rating ? +modelUser.rating : ''
    };
    return this.apiService
      .post(url, infoUser)
      .map(response => response.result)
  }

  updateInfouser(modelUser): Observable<any> {
    const url = `user/update`;
    const infoUser = {
      id: modelUser.id ? +modelUser.id : '',
      email: modelUser.email ? String(modelUser.email) : '',
      type: modelUser.typeuser ? String(modelUser.typeuser) : '',
      organizationName: modelUser.name ? String(modelUser.name) : '',
      taxNumber: modelUser.taxnumber ? String(modelUser.taxnumber) : '',
      acronymName: modelUser.acronym ? String(modelUser.acronym) : '',
      representative: modelUser.representative ? String(modelUser.representative) : '',
      phone: modelUser.phone ? String(modelUser.phone) : '',
      fax: modelUser.fax ? String(modelUser.fax) : '',
      website: modelUser.website ? String(modelUser.website) : '',
      stateProvinceID: (modelUser.province && modelUser.province !== 'null') ? +modelUser.province : '',
      districtID: (modelUser.district && modelUser.district !== 'null') ? +modelUser.district : '',
      communeID: (modelUser.ward && modelUser.ward !== 'null') ? +modelUser.ward : '',
      houseNumber: modelUser.home ? String(modelUser.home) : '',
      address: modelUser.fulladdress ? String(modelUser.fulladdress) : '',
      identityCard: modelUser.identification ? String(modelUser.identification) : '',
      status: modelUser.status ? String(modelUser.status) : '',
      avatar: modelUser.profilePic ? String(modelUser.profilePic) : '',
      evaluate: modelUser.rating ? +modelUser.rating : ''
    };
    return this.apiService
      .post(url, infoUser)
      .map(response => response.result)
  }

  getInfoUser(userId): Observable<UserBuyerModel> {
    const url = `user/${userId}`;
    return this.apiService.get(url).map(response => {
      const result = response.result;
      return {
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
    });
  }

  deleteUser(userId) {
    const url = `user/${userId}/delete`;
    return this.apiService.get(url).map(response => {
      return response.result;
    })
  }
  deleteMultiUsers(userIds) {
    const url = `user/multidelete`;
    return this.apiService.post(url, { Ids: [...userIds] }).map(response => response.result);
  }

  confirmAccountByAdmin(accountId) {
    const url = `account/${accountId}/confirm`;
    return this.apiService.post(url).map(response => response);
  }

  resetPasswordByAdmin(userId) {
    const url = `${userId}/password/reset`;
    return this.apiService.post(url).map(response => response.result)
  }

  changeProfileAvatar(userId, image) {
    const url = `user/${userId}/updateavatar`;
    const formImage = new FormData();
    formImage.append('ImageFiles', image);
    return this.apiService.postFile(url, formImage).map(res => res.result);
  }

  // Search
  searchUserKeyWord(
    searchTerm: Observable<string>,
    filter: UserBuyerFilter,
    page: number | string,
    pageSize: number | string
  ): Observable<PagedResult<UserBuyerItem>> {
    const filterUrl = `user/filter/${page}/${pageSize}?searchTerm=`;
    const urlParams = ManageBuyerService.createUserFilterParams(filter);
    return this.instantSearchService
      .searchWithFilter(filterUrl, searchTerm, urlParams)
      .map(res => {
        return {
          currentPage: res.pageIndex,
          pageSize: res.pageSize,
          pageCount: res.totalPages,
          total: res.totalCount,
          items: (res.items || []).map(ManageBuyerService.toUserBuyerItem)
        };
      });
  }

  // Gọi thông thường
  filterUserList(
    searchTerm: string,
    filter: UserBuyerFilter,
    page: number | string,
    pageSize: number | string
  ): Observable<PagedResult<UserBuyerItem>> {
    const filterUrl = `user/filter/${page}/${pageSize}?searchTerm=${searchTerm}`;
    const urlParams = ManageBuyerService.createUserFilterParams(filter);
    return this.apiService.get(filterUrl, urlParams).map(response => {
      const result = response.result;
      return {
        currentPage: result.pageIndex,
        pageSize: result.pageSize,
        pageCount: result.totalPages,
        total: result.totalCount,
        items: (result.items || []).map(ManageBuyerService.toUserBuyerItem)
      };
    });
  }

}
