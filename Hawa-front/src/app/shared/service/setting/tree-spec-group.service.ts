import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api.service';
import { TreeSpecGroup, TreeSpec } from '../../model/setting/tree-spec-group/tree-spec-group.model';
import { InstantSearchService } from '../instant-search.service';
import { PagedResult } from '../../model/dictionary/paging-result.model';

@Injectable({
  providedIn: 'root'
})
export class TreeSpecGroupService {

  constructor(
    private apiService: ApiService,
    private instantSearchService: InstantSearchService
  ) { }
  // searchTerm: Observable<string>
  getListOfTreeSpecs(): Observable<TreeSpec[]> {
    const url = `treespecs`;
    return this.apiService.get(url).map(res => {
      return res.result.map(item => ({
        id: item.id,
        name: item.name,
        acronym: item.acronym,
        latin: item.latin,
        geoDistribution: item.geoDistribution,
        isSpecialProduct: item.isSpecialProduct,
        checked: false
      }))
    })
    // return this.instantSearchService.search(url, searchTerm).map(res => {
    //   return res.map(item => ({
    //     id: item.id,
    //     name: item.name,
    //     acronym: item.acronym,
    //     latin: item.latin,
    //     geoDistribution: item.geoDistribution,
    //     isSpecialProduct: item.isSpecialProduct,
    //     checked: false
    //   }))
    // })
  }


  getListTreeSpecGroup(
    searchTerm: Observable<string>,
    page: number | string,
    pageSize: number | string): Observable<PagedResult<TreeSpecGroup>> {
    const url = `treespecgroups/filter/${page}/${pageSize}?searchTerm=`;
    return this.instantSearchService.search(url, searchTerm).map(response => {
      return {
        currentPage: response.pageIndex,
        pageSize: response.pageSize,
        pageCount: response.totalPages,
        total: response.totalCount,
        items: (response.items || []).map(item => ({
          id: item.id,
          name: item.name,
          desc: item.desc,
          createdDate: item.createdDate,
          treeSpecs: (item.treeSpecs || []).map(a => ({
            id: a.id,
            name: a.name,
            acronym: a.acronym,
            latin: a.latin,
            geoDistribution: a.geoDistribution,
            isSpecialProduct: a.isSpecialProduct
          })),
          checked: false
        }))
      };
    })
  }
  getListTreeSpecGroupNoQuery(): Observable<TreeSpecGroup[]> {
    const url = `treespecgroups/filter`;
    return this.apiService.get(url).map(res => {
      return res.result.map(item => ({
        id: item.id,
        name: item.name,
        desc: item.desc,
        createdDate: item.createdDate,
        treeSpecs: (item.treeSpecs || []).map(treeSpec => ({
          id: treeSpec.id,
          name: treeSpec.name,
          acronym: treeSpec.acronym,
          latin: treeSpec.latin,
          geoDistribution: treeSpec.geoDistribution,
          isSpecialProduct: treeSpec.isSpecialProduct
        }))
      }))
    })
  }
  createTreeSpecGroup(modelTreeSpecGroup: TreeSpecGroup, listTreeSpecs): Observable<TreeSpecGroup> {
    const url = `treespecgroups/create`;
    const infoTreeSpecGroup = {
      name: modelTreeSpecGroup.name,
      desc: modelTreeSpecGroup.desc,
      treeSpecIds: [...listTreeSpecs]
    }
    return this.apiService.post(url, infoTreeSpecGroup).map(res => res.result)
  }
  editTreeSpecGroup(treeSpecGroupId: number | string, modelTreeSpecGroup: TreeSpecGroup, listTreeSpecs): Observable<TreeSpecGroup> {
    const url = `treespecgroups/edit`;
    const infoTreeSpecGroup = {
      id: treeSpecGroupId,
      name: modelTreeSpecGroup.name,
      desc: modelTreeSpecGroup.desc,
      treeSpecIds: [...listTreeSpecs]
    }
    return this.apiService.post(url, infoTreeSpecGroup).map(res => res.result)
  }
  detailTreeSpecGroup(treeSpecGroupId: number | string): Observable<TreeSpecGroup> {
    const url = `treespecgroups/${treeSpecGroupId}`;
    // treespecgroups/{treeSpecGroupId}
    return this.apiService.get(url).map(response => {
      const res = response.result && {
        id: response.result.id,
        name: response.result.name,
        desc: response.result.desc,
        createdDate: response.result.createdDate,
        checked: false,
        treeSpecs: (response.result.treeSpecs || []).map(item => ({
          id: item.id,
          name: item.name,
          acronym: item.acronym,
          latin: item.latin,
          geoDistribution: item.geoDistribution,
          isSpecialProduct: item.isSpecialProduct,
          checked: false
        }))
      };
      return res;
    })
  }
  deleteTreeSpecGroup(treeSpecGroupId: number | string) {
    const url = `treespecgroups/${treeSpecGroupId}/delete`;
    return this.apiService.post(url).map(response => {
      return response.result;
    })
  }
}

// treespecgroups/{treeSpecGroupId}/delete