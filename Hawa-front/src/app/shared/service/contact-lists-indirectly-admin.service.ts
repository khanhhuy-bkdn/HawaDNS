import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { PagedResult } from '../model/dictionary/paging-result.model';
import { ContacListIndirect } from '../model/contact/contact-list-indirect.model';
import { FilterContactListIndirect } from '../model/contact/filter-contact-list-indirect.model';
import { URLSearchParams } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class ContactListsIndirectlyAdminService {
  filterList = new FilterContactListIndirect();
  constructor(
    private apiService: ApiService,
  ) { }

  private static createFilterContactsParams(filter: FilterContactListIndirect): URLSearchParams {
    const urlFilterParams = new URLSearchParams();
    urlFilterParams.append('stateProvinceId', filter.stateProvinceId.toString());
    urlFilterParams.append('districtId', filter.districtId.toString());
    urlFilterParams.append('communeId', filter.communeId.toString());
    urlFilterParams.append('compartmentId', filter.compartmentId.toString());
    return urlFilterParams;
  }


  // mapping Model 
  mappingContactList(result: any): ContacListIndirect {
    return {
      forestPlotId: result.forestPlotId,
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
      compartment: result.compartment && {
        key: result.compartment.key,
        code: result.compartment.code,
        text: result.compartment.text
      },
      subCompartment: result.subCompartment && {
        key: result.subCompartment.key,
        code: result.subCompartment.code,
        text: result.subCompartment.text
      },
      plotCode: result.plotCode,
      reviewCount: result.reviewCount,
      notConfirmStatusCount: result.notConfirmStatusCount,
      pendingStatusCount: result.pendingStatusCount
    }
  }

  // Thông tin xã và liên hệ đóng góp gián tiếp của xã đó
  filterContactLists(
    filterModel: FilterContactListIndirect,
    page: number | string,
    pageSize: number | string
  ): Observable<PagedResult<ContacListIndirect>> {
    const url = `communes/contactstatuscount/filter/${page}/${pageSize}?searchTerm=`;
    const urlParams = ContactListsIndirectlyAdminService.createFilterContactsParams(filterModel);
    return this.apiService.get(url, urlParams).map(response => {
      const result = response.result;
      return {
        currentPage: result.pageIndex,
        pageSize: result.pageSize,
        pageCount: result.totalPages,
        total: result.totalCount,
        items: (result.items || []).map(this.mappingContactList)
      };
    });
  }

}
