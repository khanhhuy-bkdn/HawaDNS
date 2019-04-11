import { Injectable } from '@angular/core';
import { ForestPlotItem } from '../../model/contribute-information/forest-plot-item.model';
import { Observable } from 'rxjs';
import { PagedResult } from '../../model/dictionary/paging-result.model';
import { ApiService } from '../api.service';
import { InstantSearchService } from '../instant-search.service';
import { URLSearchParams } from '@angular/http';
import { ContributeStatus } from '../../model/contribute-information/contribute-status.model';
import { PagedExtraResult } from '../../model/contribute-information/paged-extra-result.model';
import { ExtraDataContribute } from '../../model/contribute-information/extradata-detail.model';

@Injectable({
  providedIn: 'root'
})
export class ManagerForestPlotService {

  constructor(
    private apiService: ApiService,
    private instantSearchService: InstantSearchService
  ) { }
  private static createForestPlotParams(filter: ContributeStatus): URLSearchParams {
    const urlFilterParams = new URLSearchParams();
    if (filter.contactStatus) {
      urlFilterParams.append(
        'contactStatus',
        filter.contactStatus ? filter.contactStatus.toString() : ''
      );
    }
    return urlFilterParams;
  }
  private static toForestPlotItem(result: any): ForestPlotItem {
    return {
      id: result.id,
      contactName: result.contactName,
      userContact: result.userContact,
      phone1: result.phone1,
      contributor: result.contributor,
      contributeDate: result.contributeDate,
      evalution: result.evalution,
      email: result.email,
      status: result.status && {
        key: result.status.key,
        code: result.status.code,
        text: result.status.text,
      },
      averageRating: result.averageRating,
      aggregateOfRatings: (result.aggregateOfRatings || []).map(item => ({
        rating: item.rating,
        percent: item.percent,
      })),
    };
  }


  // Liên hệ gián tiếp đóng góp
  instantSearchPlots(
    communeId: number | string,
    searchTerm: Observable<string>,
    filter: ContributeStatus,
    page: number | string,
    pageSize: number | string
  ): Observable<PagedExtraResult<ForestPlotItem, ExtraDataContribute>> {
    const searchUrl = `commune/${communeId}/contacts/filter/${page}/${pageSize}?searchTerm=`;
    // const urlParams = ManagerForestPlotService.createForestPlotParams(filter);
    // return this.instantSearchService
    //   .searchWithFilter(searchUrl, searchTerm, urlParamsSearch)
    //   .map(response => {
    //     return {
    //       extraData: response.extraData && {
    //         chuaDuyet: response.extraData.chuaDuyet,
    //         stateProvince: response.extraData.stateProvince && {
    //           key: response.extraData.stateProvince.key,
    //           code: response.extraData.stateProvince.code,
    //           text: response.extraData.stateProvince.text
    //         },
    //         daDuyet: response.extraData.daDuyet,
    //         dangXacMinh: response.extraData.dangXacMinh,
    //         huyBo: response.extraData.huyBo,
    //         commune: response.extraData.commune && {
    //           key: response.extraData.commune.key,
    //           code: response.extraData.commune.code,
    //           text: response.extraData.commune.text
    //         },
    //         district: response.extraData.district && {
    //           key: response.extraData.district.key,
    //           code: response.extraData.district.code,
    //           text: response.extraData.district.text
    //         },
    //         total: response.extraData.total
    //       },
    //       currentPage: response.pageIndex,
    //       pageSize: response.pageSize,
    //       pageCount: response.totalPages,
    //       total: response.totalCount,
    //       items: (response.items || []).map(ManagerForestPlotService.toForestPlotItem)
    //     };
    //   })

    return searchTerm
      .debounceTime(600)
      .distinctUntilChanged()
      .switchMap(term => {
        const urlParams = ManagerForestPlotService.createForestPlotParams(filter);
        // return this.searchEntries(searchUrl + term, urlParams)
        return this.apiService
          .get(searchUrl + term, urlParams)
          .map(response => {
            response = response.result;
            return {
              extraData: response.extraData && {
                chuaDuyet: response.extraData.chuaDuyet,
                stateProvince: response.extraData.stateProvince && {
                  key: response.extraData.stateProvince.key,
                  code: response.extraData.stateProvince.code,
                  text: response.extraData.stateProvince.text
                },
                daDuyet: response.extraData.daDuyet,
                dangXacMinh: response.extraData.dangXacMinh,
                huyBo: response.extraData.huyBo,
                commune: response.extraData.commune && {
                  key: response.extraData.commune.key,
                  code: response.extraData.commune.code,
                  text: response.extraData.commune.text
                },
                district: response.extraData.district && {
                  key: response.extraData.district.key,
                  code: response.extraData.district.code,
                  text: response.extraData.district.text
                },
                total: response.extraData.total
              },
              currentPage: response.pageIndex,
              pageSize: response.pageSize,
              pageCount: response.totalPages,
              total: response.totalCount,
              items: (response.items || []).map(ManagerForestPlotService.toForestPlotItem)
            };
          });
      }
      );
  }
  searchPlotList(
    communeId: number | string,
    searchTerm: string,
    filter: ContributeStatus,
    page: number | string,
    pageSize: number | string
  ): Observable<PagedExtraResult<ForestPlotItem, ExtraDataContribute>> {
    const filterUrl = `commune/${communeId}/contacts/filter/${page}/${pageSize}?searchTerm=${searchTerm}`;
    const urlParams = ManagerForestPlotService.createForestPlotParams(filter);
    return this.apiService.get(filterUrl, urlParams).map(response => {
      const result = response.result;
      return {
        extraData: result.extraData && {
          chuaDuyet: result.extraData.chuaDuyet,
          stateProvince: result.extraData.stateProvince && {
            key: result.extraData.stateProvince.key,
            code: result.extraData.stateProvince.code,
            text: result.extraData.stateProvince.text
          },
          daDuyet: result.extraData.daDuyet,
          dangXacMinh: result.extraData.dangXacMinh,
          huyBo: result.extraData.huyBo,
          commune: result.extraData.commune && {
            key: result.extraData.commune.key,
            code: result.extraData.commune.code,
            text: result.extraData.commune.text
          },
          district: result.extraData.district && {
            key: result.extraData.district.key,
            code: result.extraData.district.code,
            text: result.extraData.district.text
          },
          total: result.extraData.total
        },
        currentPage: result.pageIndex,
        pageSize: result.pageSize,
        pageCount: result.totalPages,
        total: result.totalCount,
        items: (result.items || []).map(ManagerForestPlotService.toForestPlotItem)
      };
    });
  }
}
