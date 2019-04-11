import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { AdministrativeUnit } from '../model/dictionary/administrative-unit';
import { TreespecsList } from '../model/treespecs-list.model';
import { PagedResult } from '../model/dictionary/paging-result.model';
import { GroupTree } from '../model/forest-plot/group-tree.model';
import { InstantSearchService } from './instant-search.service';
import { MasterDataAll } from '../model/master-data/master-data-all.model';
import { shareReplay } from '../../../../node_modules/rxjs/operators';
const CACHE_SIZE = 1;
@Injectable({
  providedIn: 'root'
})
export class DataGeneralService {
  private cacheMasterDataAll$: Observable<MasterDataAll>;
  private static toggleSideMenu = new BehaviorSubject<boolean>(false);
  constructor(
    private apiService: ApiService,
    private instantSearchService: InstantSearchService
  ) { }
  followSideMenu() {
    return DataGeneralService.toggleSideMenu;
  }
  toggleValueSideMenu(value) {
    DataGeneralService.toggleSideMenu.next(value);
  }


  get getMasterData() {
    if (!this.cacheMasterDataAll$) {
      this.cacheMasterDataAll$ = this.getMasterDataAll().pipe(
        shareReplay(CACHE_SIZE)
      );
    }
    return this.cacheMasterDataAll$;
  }

  // Danh sách master data
  getMasterDataAll(): Observable<any> {
    const url = `data/all`;
    return this.apiService.get(url).map(response => response.result);
  }

  // Danh sách tỉnh/thành Việt Nam
  getProvinces(): Observable<AdministrativeUnit[]> {
    const url = `data/stateprovinces`;
    return this.apiService.get(url).map(response => {
      const result = response.result;
      return result.map(province => ({
        key: province.key,
        code: province.code,
        text: province.text
      }));
    });
  }

  // Danh sách tỉnh/thành Việt Nam không bị ẩn
  getProvincesNotHidden(): Observable<AdministrativeUnit[]> {
    const url = `data/stateprovinces/show`;
    return this.apiService.get(url).map(response => {
      const result = response.result;
      return result.map(province => ({
        key: province.key,
        code: province.code,
        text: province.text
      }));
    });
  }


  searchProvinces(searchTerm: Observable<string>): Observable<any> {
    const url = `data/stateprovinces?searchTerm=`;
    return this.instantSearchService
      .search(url, searchTerm)
      .map(res => res)
  }
  // Danh sách quận huyện theo tỉnh/thành
  getDistricts(provinceCode): Observable<AdministrativeUnit[]> {
    const url = `data/districts?stateProviceCode=${provinceCode}`;
    return this.apiService.get(url).map(response => {
      const result = response.result;
      return result.map(district => ({
        key: district.key,
        code: district.code,
        text: district.text
      }))
    })
  }
  // Danh sách xã/phường theo quận/huyện
  getWards(districtCode): Observable<AdministrativeUnit[]> {
    const url = `data/communes?districtCode=${districtCode}`;
    return this.apiService.get(url).map(response => {
      const result = response.result;
      return result.map(ward => ({
        key: ward.key,
        code: ward.code,
        text: ward.text
      }))
    })
  }
  // Danh sách tiểu khu theo xã/phường
  getCompartments(communeId): Observable<AdministrativeUnit[]> {
    const url = `data/commune/${communeId}/compartments`;
    return this.apiService.get(url).map(response => {
      const result = response.result;
      return result.map(ward => ({
        key: ward.key,
        code: ward.code,
        text: ward.text
      }))
    })
  }
  // Danh sách khoảnh theo tiểu khu
  getSubCompartments(compartmentId): Observable<AdministrativeUnit[]> {
    const url = `data/compartment/${compartmentId}/subCompartments`;
    return this.apiService.get(url).map(response => {
      const result = response.result;
      return result.map(ward => ({
        key: ward.key,
        code: ward.code,
        text: ward.text
      }))
    })
  }
  // // Danh sách tiểu khu theo xã/phường
  // getCompartments(communeCode): Observable<AdministrativeUnit[]> {
  //   const url = `data/compartments?communeCode=${communeCode}`;
  //   return this.apiService.get(url).map(response => {
  //     const result = response.result;
  //     return result.map(ward => ({
  //       key: ward.key,
  //       code: ward.code,
  //       text: ward.text
  //     }))
  //   })
  // }

  // Danh sách loài cây theo nhóm phân trang
  getTreespecs(
    treeSpecGroupId: number,
    page: number,
    pageSize: number
  ): Observable<PagedResult<TreespecsList>> {
    const url = `treespecgroup/${treeSpecGroupId ? treeSpecGroupId : 0}/treespecs/filter/${page}/${pageSize}`;
    return this.apiService.get(url).map(response => {
      const result = response.result;
      return {
        currentPage: result.pageIndex,
        pageSize: result.pageSize,
        pageCount: result.totalPages,
        total: result.totalCount,
        items: (result.items || []).map(item => {
          return {
            id: item.id,
            name: item.name,
            acronym: item.acronym,
            latin: item.latin,
            geoDistribution: item.geoDistribution,
            isSpecialProduct: item.isSpecialProduct,
          }
        })
      };
    })
  }

  // Loài cây get ALL
  getTreespecsAll(
  ): Observable<TreespecsList[]> {
    const url = `treespecs`;
    return this.apiService.get(url).map(response => {
      const result = response.result;
      return result.map(item => {
        return {
          id: item.id,
          name: item.name,
          acronym: item.acronym,
          latin: item.latin,
          geoDistribution: item.geoDistribution,
          isSpecialProduct: item.isSpecialProduct,
        }
      })
    });
  }

  // Tải ảnh lên server
  uploadImage(images) {
    const url = `image/upload`;
    const formData = new FormData();
    formData.append('File', images);
    // for (const image of images) {
    //   formData.append('File', image);
    // }
    return this.apiService.postFile(url, formData).map(res => res.result);
  }
  // Xóa ảnh
  deleteImage(guid) {
    const url = `image/delete`;
    const request = {
      guid: guid
    }
    return this.apiService.post(url, request);
  }

  changePassword(oldPassword, newPassword) {
    const url = `me/password/change`;
    const dto = {
      oldPassword: `${oldPassword}`,
      newPassword: `${newPassword}`
    }
    // return this.apiService.postCustom(url, dto).map(response => response);
    return this.apiService.post(url, dto).map(response => response);
  }

  // Danh sách nhóm loài cây phân trang
  groupTreesList(
    page: number,
    pageSize: number
  ): Observable<PagedResult<GroupTree>> {
    const url = `treespecgroup/filter/${page}/${pageSize}`;
    return this.apiService.get(url).map(response => {
      const result = response.result;
      return {
        currentPage: result.pageIndex,
        pageSize: result.pageSize,
        pageCount: result.totalPages,
        total: result.totalCount,
        items: (result.items || []).map(item => {
          return {
            id: item.id,
            name: item.name,
            desc: item.desc,
          }
        })
      };
    })
  }

}
