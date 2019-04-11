import { Injectable } from '@angular/core';
import { PagedResult } from '../../../model/dictionary/paging-result.model';
import { Observable } from 'rxjs';
import { StateProvinceList } from '../../../model/setting/state-province/state-province-list.model';
import { InstantSearchService } from '../../instant-search.service';
import { ApiService } from '../../api.service';
import { URLSearchParams } from '@angular/http';
import { distinctUntilChanged, debounceTime, switchMap } from 'rxjs/operators';
import { FilterStateProvince } from '../../../model/setting/state-province/filter-state-province.model';
@Injectable({
  providedIn: 'root'
})
export class StateProvinceService {

  constructor(
    private apiService: ApiService,
    private instantSearchService: InstantSearchService
  ) { }

  // Create params StateProvince cho danh sách tỉnh/thành Việt Nam
  createFilterParamsStateProvinceList(filterModel): URLSearchParams {
    const urlFilterParams = new URLSearchParams();
    urlFilterParams.append(
      'isHidden',
      filterModel.isHidden ? filterModel.isHidden.toString() : ''
    );
    return urlFilterParams;
  }
  // mapping model danh sách tỉnh/thành Việt Nam
  mappingStateProvinceList(result: any): StateProvinceList {
    return {
      id: result.id,
      name: result.name,
      isHidden: result.isHidden,
      code: result.code,
    }
  }

  // Danh sách tỉnh/thành Việt Nam ----- search
  searchKeyWordGetStateProvinceList(
    searchTerm: Observable<string>,
    filterModel: FilterStateProvince,
    page: number,
    pageSize: number,
  ): Observable<PagedResult<StateProvinceList>> {
    const filterUrl = `stateprovinces/filter/${page}/${pageSize}?searchTerm=`;
    return searchTerm
      .pipe(
        debounceTime(600),
        distinctUntilChanged(),
        switchMap(term => {
          const urlParams = this.createFilterParamsStateProvinceList(filterModel);
          return this.apiService
            .get(filterUrl + term, urlParams)
            .map(response => {
              const result = response.result;
              return {
                currentPage: result.pageIndex,
                pageSize: result.pageSize,
                pageCount: result.totalPages,
                total: result.totalCount,
                items: (result.items || []).map(this.mappingStateProvinceList)
              };
            });
        }
        )
      )

      ;
  }


  // Danh sách tỉnh/thành Việt Nam ----- Không search
  getStateProvinceListFilter(
    searchTerm: string,
    filterModel: FilterStateProvince,
    page: number,
    pageSize: number,
  ): Observable<PagedResult<StateProvinceList>> {
    const filterUrl = `stateprovinces/filter/${page}/${pageSize}?searchTerm=${searchTerm}`;
    const urlParams = this.createFilterParamsStateProvinceList(filterModel);
    return this.apiService.get(filterUrl, urlParams)
      .map(response => {
        const result = response.result;
        return {
          currentPage: result.pageIndex,
          pageSize: result.pageSize,
          pageCount: result.totalPages,
          total: result.totalCount,
          items: (result.items || []).map(this.mappingStateProvinceList)
        };
      });
  }

  // Ẩn một tỉnh thành
  hideStateProvince(stateProvinceId: number) {
    const url = `stateprovince/${stateProvinceId}/hide`;
    return this.apiService.post(url);
  }


  // Hiện một tỉnh thành
  showStateProvince(stateProvinceId: number) {
    const url = `stateprovince/${stateProvinceId}/show`;
    return this.apiService.post(url);
  }


}
