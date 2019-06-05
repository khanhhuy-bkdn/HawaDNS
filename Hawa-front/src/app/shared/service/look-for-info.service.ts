import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResult } from '../model/dictionary/paging-result.model';
import { OverviewForest } from '../model/overview-forest.model';
import { FilterOVerviewForest } from '../model/filter-overview-forest.model';
import { URLSearchParams } from '@angular/http';
import { ApiService } from './api.service';
import { ForestSpecailOrCommune } from '../model/forest-specailOrCommune.model';
import { FilteForestSpecailOrCoomune } from '../model/filter-forest-specailOrCoomune.model';
import { InstantSearchService } from './instant-search.service';
import { ActorModel } from '../model/actor/actor.model';
import { Administration } from '../model/forest-plot/administration.model';
import { CreateActorReview } from '../model/actor/create-actor-review.model';
import { ActorReviewModel } from '../model/actor/actor-review.model';
import { map } from 'rxjs-compat/operator/map';
import { CreateContactReview } from '../model/contact/create-contact-review.model';
import { ReviewContactList } from '../model/contact/review-contact-list.model';
import { ActorForesplot } from '../model/actor/actor-foresplot.model';
import { FeedBackList } from '../model/feed-back/feed-back-list.model';
import { PagedResultContactList } from '../model/contact/page-result-contact-list.model';
import { PagedResultActorForestList } from '../model/actor/page-result-actor-forest-list.model';
@Injectable({
  providedIn: 'root',
})
export class LookForInfoService {
  detailsofTreeSpecies: OverviewForest;
  filterList = null;
  currentPage = null;
  pageSize = null;
  constructor(
    private apiService: ApiService,
    private instantSearchService: InstantSearchService,
  ) { }
  // tạo filter Params cho danh sách thông tin tổng quan về rừng
  createFilterParamsForestplotlist(filterModel: FilterOVerviewForest): URLSearchParams {
    const urlFilterParams = new URLSearchParams();
    urlFilterParams.append(
      'stateProvinceID',
      (filterModel.stateProvinceID && filterModel.stateProvinceID.key) ? filterModel.stateProvinceID.key.toString() : '',
    );
    urlFilterParams.append(
      'districtID',
      (filterModel.districtID && filterModel.districtID.key) ? filterModel.districtID.key.toString() : '',
    );
    urlFilterParams.append(
      'communeID',
      (filterModel.communeID && filterModel.communeID.key) ? filterModel.communeID.key.toString() : '',
    );
    urlFilterParams.append(
      'treeSpecID',
      (filterModel.treeSpecID && filterModel.treeSpecID.id) ? filterModel.treeSpecID.id.toString() : '',
    );
    urlFilterParams.append(
      'treeSpecGroupID',
      (filterModel.treeSpecGroupID && filterModel.treeSpecGroupID.id) ? filterModel.treeSpecGroupID.id.toString() : '',
    );
    urlFilterParams.append(
      'sorting',
      filterModel.sorting ? filterModel.sorting.toString() : '',
    );
    return urlFilterParams;
  }

  // Mapping model Danh sách thông tin tổng quan về rừng (lọc và sorting)
  mappingForestplotlist(result: any): OverviewForest {
    return {
      // id: result.id,
      stateProvince: result.stateProvince ? {
        key: result.stateProvince.key,
        code: result.stateProvince.code,
        text: result.stateProvince.text,
      } : null,
      district: result.district ? {
        key: result.district.key,
        code: result.district.code,
        text: result.district.text,
      } : null,
      commune: result.commune ? {
        key: result.commune.key,
        code: result.commune.code,
        text: result.commune.text,
      } : null,
      treeSpec: result.treeSpec ? {
        id: result.treeSpec.id,
        name: result.treeSpec.name,
        acronym: result.treeSpec.acronym,
        latin: result.treeSpec.latin,
        geoDistribution: result.treeSpec.geoDistribution,
        isSpecialProduct: result.treeSpec.isSpecialProduct,
      } : null,
      volumnPerPlot: result.volumnPerPlot,
      area: result.area,
      locationLatitudeCommune: result.locationLatitudeCommune,
      locationLongitudeCommune: result.locationLongitudeCommune,
    };
  }

  // Danh sách thông tin tổng quan về rừng (lọc và sorting)
  getForestplotlist(
    filter: FilterOVerviewForest,
    page: number,
    pageSize: number,
  ): Observable<PagedResult<OverviewForest>> {
    const url = `forestplot/filter/${page}/${pageSize}`;
    const urlParams = this.createFilterParamsForestplotlist(filter);
    return this.apiService.get(url, urlParams).map(response => {
      const result = response.result;
      return {
        currentPage: result.pageIndex,
        pageSize: result.pageSize,
        pageCount: result.totalPages,
        total: result.totalCount,
        items: (result.items || []).map(this.mappingForestplotlist),
      };
    });
  }

  // Tạo feed-back
  feedBack(isLike: boolean, content: string) {
    const userId = window.localStorage.getItem('HAWA_USER') ? JSON.parse(window.localStorage.getItem('HAWA_USER')).id : null;
    const url = `feedback/create`;
    const bodyContent = {
      isLike: isLike,
      content: content,
      userId: userId,
    };
    return this.apiService.post(url, bodyContent);
  }

  // mapping danh sách đánh giá hệ thống
  mappingFeedBackList(result: any): FeedBackList {
    return {
      isLike: result.isLike,
      date: result.date,
      content: result.content,
      user: result.user && {
        id: result.user.id,
        email: result.user.email,
        type: result.user.type && {
          key: result.user.type.key,
          code: result.user.type.code,
          text: result.user.type.text,
        },
        organizationName: result.user.organizationName,
        acronymName: result.user.acronymName,
        phone: result.user.phone,
        avatar: result.user.avatar && {
          guid: result.user.avatar.guid,
          thumbSizeUrl: result.user.avatar.thumbSizeUrl,
          largeSizeUrl: result.user.avatar.largeSizeUrl,
        },
        stateProvince: result.user.stateProvince && {
          key: result.user.stateProvince.key,
          code: result.user.stateProvince.code,
          text: result.user.stateProvince.text,
        },
        district: result.user.district && {
          key: result.user.district.key,
          code: result.user.district.code,
          text: result.user.district.text,
        },
        commune: result.user.commune && {
          key: result.user.commune.key,
          code: result.user.commune.code,
          text: result.user.commune.text,
        },
        status: result.user.status && {
          key: result.user.status.key,
          code: result.user.status.code,
          text: result.user.status.text,
        },
      },
      id: result.id,
    };
  }

  // Danh sách đánh giá hệ thống
  feedBackList(isLike: boolean, page: number, pageSize: number): Observable<PagedResult<FeedBackList>> {
    const url = `feedback/0/10?isLike=${isLike}`;
    return this.apiService.get(url).map(response => {
      const result = response.result;
      return {
        currentPage: result.pageIndex,
        pageSize: result.pageSize,
        pageCount: result.totalPages,
        total: result.totalCount,
        items: (result.items || []).map(this.mappingFeedBackList),
      };
    });
  }

  // Create param url cho Danh sách thông tin về rừng theo loại cây của từng xã(lọc và sorting)
  createFilterParamsForesttoSpeciesOrCommuneList(filterModel: FilteForestSpecailOrCoomune): URLSearchParams {
    const urlFilterParams = new URLSearchParams();
    urlFilterParams.append(
      'communeID',
      filterModel.communeID ? filterModel.communeID.toString() : '',
    );
    urlFilterParams.append(
      'treeSpecID',
      (filterModel.treeSpecID && (+filterModel.treeSpecID !== 0)) ? filterModel.treeSpecID.toString() : '',
    );
    urlFilterParams.append(
      'forestCertID',
      (filterModel.forestCertID && filterModel.forestCertID !== 'null') ? filterModel.forestCertID.toString() : '',
    );
    urlFilterParams.append(
      'oldFrom',
      (filterModel.oldFrom || filterModel.oldFrom === 0) ? filterModel.oldFrom.toString() : '',
    );
    urlFilterParams.append(
      'oldTo',
      (filterModel.oldTo || filterModel.oldTo === 0) ? filterModel.oldTo.toString() : '',
    );
    urlFilterParams.append(
      'treeSpecGroupID',
      filterModel.treeSpecGroupID ? filterModel.treeSpecGroupID.toString() : '',
    );
    urlFilterParams.append(
      'reliability',
      (filterModel.reliability && filterModel.reliability !== 'null') ? filterModel.reliability.toString() : '',
    );
    urlFilterParams.append(
      'sorting',
      filterModel.sorting ? filterModel.sorting.toString() : '',
    );
    return urlFilterParams;
  }
  // Mapping to model cho Danh sách thông tin về rừng theo loại cây của từng xã(lọc và sorting)
  mappingForesttoSpeciesOrCommuneList(result: any): ForestSpecailOrCommune {
    return {
      id: result.id,
      treeSpec: result.treeSpec ? {
        id: result.treeSpec.id,
        name: result.treeSpec.name,
        acronym: result.treeSpec.acronym,
        latin: result.treeSpec.latin,
        geoDistribution: result.treeSpec.geoDistribution,
        isSpecialProduct: result.treeSpec.isSpecialProduct,
      } : null,
      compartment: result.compartment ? {
        key: result.compartment.key,
        code: result.compartment.code,
        text: result.compartment.text,
      } : null,
      compartmentCode: result.compartmentCode,
      subCompartment: result.subCompartment ? {
        key: result.subCompartment.key,
        code: result.subCompartment.code,
        text: result.subCompartment.text,
      } : null,
      subCompartmentCode: result.subCompartmentCode,
      plot: result.plot ? {
        key: result.plot.key,
        code: result.plot.code,
        text: result.plot.text,
      } : null,
      plotCode: result.plotCode,
      volumnPerPlot: result.volumnPerPlot,
      area: result.area,
      plantingYear: result.plantingYear,
      dispute: result.dispute ? {
        key: result.dispute.key,
        code: result.dispute.code,
        text: result.dispute.text,
      } : null,
      actor: result.actor ? {
        id: result.actor.id,
        name: result.actor.name,
        email: result.actor.email,
        phone: result.actor.phone,
        website: result.actor.website,
        avatar: result.avatar ? {
          guid: result.avatar.guid,
          thumbSizeUrl: result.avatar.thumbSizeUrl,
          largeSizeUrl: result.avatar.largeSizeUrl,
        } : null,
      } : null,
      actorType: result.actorType ? {
        id: result.actorType.id,
        name: result.actorType.name,
        code: result.actorType.code,
        acronymName: result.actorType.acronymName,
      } : null,
      forestCert: result.forestCert ? {
        key: result.forestCert.key,
        code: result.forestCert.code,
        text: result.forestCert.text,
      } : null,
      reliability: result.reliability ? {
        key: result.reliability.key,
        code: result.reliability.code,
        text: result.reliability.text,
      } : null,
      landUseCert: result.landUseCert ? {
        key: result.landUseCert.key,
        code: result.landUseCert.code,
        text: result.landUseCert.text,
      } : null,
      conflictSitCode: result.conflictSitCode,
      locationLatitude: result.locationLatitude,
      locationLongitude: result.locationLongitude,
      plantingDate: result.plantingDate,
    };
  }
  // SEARCH Danh sách thông tin về rừng theo loại cây của từng xã(lọc và sorting)
  searchKeyWordForesttoSpeciesOrCommuneList(
    searchTerm: Observable<string>,
    filter: FilteForestSpecailOrCoomune,
    page: number | string,
    pageSize: number | string,
  ): Observable<Administration<ForestSpecailOrCommune>> {
    const filterUrl = `forestplot/detail/filter/${page}/${pageSize}?searchTerm=`;
    return searchTerm
      .debounceTime(600)
      .distinctUntilChanged()
      .switchMap(term => {
        const urlParams = this.createFilterParamsForesttoSpeciesOrCommuneList(filter);
        return this.apiService
          .get(filterUrl + term, urlParams)
          .map(response => {
            response = response.result;
            return {
              extraData: response.extraData ? {
                area: response.extraData.area,
                commune: response.extraData.commune ? {
                  key: response.extraData.commune.key,
                  code: response.extraData.commune.code,
                  text: response.extraData.commune.text,
                } : null,
                district: response.extraData.district ? {
                  key: response.extraData.district.key,
                  code: response.extraData.district.code,
                  text: response.extraData.district.text,
                } : null,
                stateProvince: response.extraData.stateProvince ? {
                  key: response.extraData.stateProvince.key,
                  code: response.extraData.stateProvince.code,
                  text: response.extraData.stateProvince.text,
                } : null,
                treeSpec: response.extraData.treeSpec && {
                  id: response.extraData.treeSpec.id,
                  name: response.extraData.treeSpec.name,
                  acronym: response.extraData.treeSpec.acronym,
                  latin: response.extraData.treeSpec.latin,
                  geoDistribution: response.extraData.treeSpec.geoDistribution,
                  isSpecialProduct: response.extraData.treeSpec.isSpecialProduct,
                },
                volumnPerPlot: response.extraData.volumnPerPlot,
                locationLatitudeCommune: response.extraData.locationLatitudeCommune,
                locationLongitudeCommune: response.extraData.locationLongitudeCommune,
              } : null,
              currentPage: response.pageIndex,
              pageSize: response.pageSize,
              pageCount: response.totalPages,
              total: response.totalCount,
              items: (response.items || []).map(this.mappingForesttoSpeciesOrCommuneList),
            };
          });
      },
      );
  }

  // Danh sách thông tin về rừng theo loại cây của từng xã(lọc và sorting) - không search
  getForesttoSpeciesOrCommuneList(
    searchTerm: string,
    filter: FilteForestSpecailOrCoomune,
    page: number,
    pageSize: number,
  ): Observable<Administration<ForestSpecailOrCommune>> {
    const url = `forestplot/detail/filter/${page}/${pageSize}?searchTerm=${searchTerm}`;
    const urlParams = this.createFilterParamsForesttoSpeciesOrCommuneList(filter);
    return this.apiService.get(url, urlParams).map(response => {
      const result = response.result;
      return {
        extraData: result.extraData ? {
          area: result.extraData.area,
          commune: result.extraData.commune ? {
            key: result.extraData.commune.key,
            code: result.extraData.commune.code,
            text: result.extraData.commune.text,
          } : null,
          district: result.extraData.district ? {
            key: result.extraData.district.key,
            code: result.extraData.district.code,
            text: result.extraData.district.text,
          } : null,
          stateProvince: result.extraData.stateProvince ? {
            key: result.extraData.stateProvince.key,
            code: result.extraData.stateProvince.code,
            text: result.extraData.stateProvince.text,
          } : null,
          treeSpec: result.extraData.treeSpec ? {
            id: result.extraData.treeSpec.id,
            name: result.extraData.treeSpec.name,
            acronym: result.extraData.treeSpec.acronym,
            latin: result.extraData.treeSpec.latin,
            geoDistribution: result.extraData.treeSpec.geoDistribution,
            isSpecialProduct: result.extraData.treeSpec.isSpecialProduct,
          } : null,
          volumnPerPlot: result.extraData.volumnPerPlot,
          locationLatitudeCommune: result.extraData.locationLatitudeCommune,
          locationLongitudeCommune: result.extraData.locationLongitudeCommune,
        } : null,
        currentPage: result.pageIndex,
        pageSize: result.pageSize,
        pageCount: result.totalPages,
        total: result.totalCount,
        items: (result.items || []).map(this.mappingForesttoSpeciesOrCommuneList),
      };
    });
  }

  // Mapping model thông tin chi tiết chủ rừng
  mappingActor(result: any): ActorModel {
    return {
      id: result.id,
      name: result.name,
      email: result.email,
      phone: result.phone,
      website: result.website,
      avatar: result.avatar && {
        guid: result.avatar.guid,
        thumbSizeUrl: result.avatar.thumbSizeUrl,
        largeSizeUrl: result.avatar.largeSizeUrl,
      },
      averageRating: result.averageRating,
      roles: result.roles ? result.roles.map(item => {
        return {
          key: item.key,
          code: item.code,
          text: item.text,
        };
      }) : null,
      type: result.type && {
        id: result.type.id,
        name: result.type.name,
        code: result.type.code,
        acronymName: result.type.acronymName,
      },
      identityCard: result.identityCard,
      acronymName: result.acronymName,
      representative: result.representative,
      fax: result.fax,
      address: result.address,
      houseNumber: result.houseNumber,
      stateProvince: result.stateProvince && {
        key: result.stateProvince.key,
        code: result.stateProvince.code,
        text: result.stateProvince.text,
      },
      district: result.district && {
        key: result.district.key,
        code: result.district.code,
        text: result.district.text,
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
      aggregateOfRatings: (result.aggregateOfRatings || []).map(item => ({
        rating: item.rating,
        percent: item.percent,
      })),
      reviews: (result.reviews || []).map(item => ({
        id: item.id,
        reviewUser: item.reviewUser && {
          id: item.reviewUser.id,
          email: item.reviewUser.email,
          type: item.reviewUser.type && {
            key: item.reviewUser.type.key,
            code: item.reviewUser.type.code,
            text: item.reviewUser.type.text,
          },
          organizationName: item.reviewUser.organizationName,
          acronymName: item.reviewUser.acronymName,
          phone: item.reviewUser.phone,
          avatar: item.reviewUser.avatar && {
            guid: item.reviewUser.avatar.guid,
            thumbSizeUrl: item.reviewUser.avatar.thumbSizeUrl,
            largeSizeUrl: item.reviewUser.avatar.largeSizeUrl,
          },
          stateProvince: item.reviewUser.stateProvince && {
            key: item.reviewUser.stateProvince.key,
            code: item.reviewUser.stateProvince.code,
            text: item.reviewUser.stateProvince.text,
          },
          district: item.reviewUser.district && {
            key: item.reviewUser.district.key,
            code: item.reviewUser.district.code,
            text: item.reviewUser.district.text,
          },
          commune: item.reviewUser.commune && {
            key: item.reviewUser.commune.key,
            code: item.reviewUser.commune.code,
            text: item.reviewUser.commune.text,
          },
          status: item.reviewUser.status && {
            key: item.reviewUser.status.key,
            code: item.reviewUser.status.code,
            text: item.reviewUser.status.text,
          },
        },
        rating: item.rating,
        title: item.title,
        content: item.content,
        reviewDate: item.reviewDate,
      })),
      contactName: result.contactName,
      contactPhone: result.contactPhone,
      note: result.note,
    };
  }

  // Chi tiết chủ rừng
  viewActor(actorId: number): Observable<ActorModel> {
    const url = `actor/${actorId}`;
    return this.apiService.get(url).map(response => {
      return this.mappingActor(response.result);
    });
  }

  // Chỉnh sửa thông tin chủ rừng
  editActor(valueForm: any) {
    const url = `actor/edit`;
    const imageName = valueForm.avatar && valueForm.avatar.largeSizeUrl.split('/');
    const requestModel = {
      id: valueForm.id,
      actorType: valueForm.type.name,
      actorRoles: valueForm.actorRoles ? valueForm.actorRoles.map(item => item.key) : [],
      name: valueForm.name,
      taxNumber: null,
      acronymName: valueForm.acronymName,
      representative: valueForm.representative,
      phone: valueForm.phone,
      fax: valueForm.fax,
      website: valueForm.website,
      stateProvinceID: +(valueForm.stateProvince && valueForm.stateProvince.key),
      districtID: +(valueForm.district && valueForm.district.key),
      communeID: +(valueForm.commune && valueForm.commune.key),
      communeCode: valueForm.commune && valueForm.commune.code,
      districtCode: valueForm.district && valueForm.district.code,
      stateProvinceCode: valueForm.stateProvince && valueForm.stateProvince.code,
      houseNumber: valueForm.houseNumber,
      address: valueForm.address,
      identityCard: valueForm.identityCard,
      email: valueForm.email,
      avartar: imageName ? imageName[imageName.length - 1] : null,
      actorTypeCode: valueForm.type && valueForm.type.code,
      actorTypeID: valueForm.type && valueForm.type.id,
      contactName: valueForm.contactName,
      contactPhone: valueForm.contactPhone,
      note: valueForm.note,
    };
    return this.apiService.post(url, requestModel);
  }

  createActor(valueForm: any) {
    const url = `actor/create`;
    const imageName = valueForm.avatar && valueForm.avatar.largeSizeUrl.split('/');
    const requestModel = {
      actorType: valueForm.type.name,
      actorRoles: valueForm.actorRoles ? valueForm.actorRoles.map(item => item.key) : [],
      name: valueForm.name,
      taxNumber: null,
      acronymName: valueForm.acronymName,
      representative: valueForm.representative,
      phone: valueForm.phone,
      fax: valueForm.fax,
      website: valueForm.website,
      stateProvinceID: +(valueForm.stateProvince && valueForm.stateProvince.key),
      districtID: +(valueForm.district && valueForm.district.key),
      communeID: +(valueForm.commune && valueForm.commune.key),
      communeCode: valueForm.commune && valueForm.commune.code,
      districtCode: valueForm.district && valueForm.district.code,
      stateProvinceCode: valueForm.stateProvince && valueForm.stateProvince.code,
      houseNumber: valueForm.houseNumber,
      address: valueForm.address,
      identityCard: valueForm.identityCard,
      email: valueForm.email,
      avartar: imageName ? imageName[imageName.length - 1] : null,
      actorTypeCode: valueForm.type && valueForm.type.code,
      actorTypeID: valueForm.type && valueForm.type.id,
      contactName: valueForm.contactName,
      contactPhone: valueForm.contactPhone,
      note: valueForm.note,
    };
    return this.apiService.post(url, requestModel);
  }

  // Mapping Chi tiết chủ rừng theo lô
  mappingActorToForesplot(result: any): ActorForesplot {
    return {
      id: result.id,
      name: result.name,
      email: result.email,
      phone: result.phone,
      website: result.website,
      avatar: result.avatar && {
        guid: result.avatar.guid,
        thumbSizeUrl: result.avatar.thumbSizeUrl,
        largeSizeUrl: result.avatar.largeSizeUrl,
      },
      averageRating: result.averageRating,
      aggregateOfRatings: (result.aggregateOfRatings || []).map(item => ({
        rating: item.rating,
        percent: item.percent,
      })),
      reviews: (result.reviews || []).map(item => ({
        id: item.id,
        reviewUser: item.reviewUser && {
          id: item.reviewUser.id,
          email: item.reviewUser.email,
          type: item.reviewUser.type && {
            key: item.reviewUser.type.key,
            code: item.reviewUser.type.code,
            text: item.reviewUser.type.text,
          },
          organizationName: item.reviewUser.organizationName,
          acronymName: item.reviewUser.acronymName,
          phone: item.reviewUser.phone,
          avatar: item.reviewUser.avatar && {
            guid: item.reviewUser.avatar.guid,
            thumbSizeUrl: item.reviewUser.avatar.thumbSizeUrl,
            largeSizeUrl: item.reviewUser.avatar.largeSizeUrl,
          },
          stateProvince: item.reviewUser.stateProvince && {
            key: item.reviewUser.stateProvince.key,
            code: item.reviewUser.stateProvince.code,
            text: item.reviewUser.stateProvince.text,
          },
          district: item.reviewUser.district && {
            key: item.reviewUser.district.key,
            code: item.reviewUser.district.code,
            text: item.reviewUser.district.text,
          },
          commune: item.reviewUser.commune && {
            key: item.reviewUser.commune.key,
            code: item.reviewUser.commune.code,
            text: item.reviewUser.commune.text,
          },
          status: item.reviewUser.status && {
            key: item.reviewUser.status.key,
            code: item.reviewUser.status.code,
            text: item.reviewUser.status.text,
          },
        },
        rating: item.rating,
        title: item.title,
        content: item.content,
        reviewDate: item.reviewDate,
      })),
      forestPlot: result.forestPlot && {
        stateProvince: result.forestPlot.stateProvince && {
          key: result.forestPlot.stateProvince.key,
          code: result.forestPlot.stateProvince.code,
          text: result.forestPlot.stateProvince.text,
        },
        district: result.forestPlot.district && {
          key: result.forestPlot.district.key,
          code: result.forestPlot.district.code,
          text: result.forestPlot.district.text,
        },
        commune: result.forestPlot.commune && {
          key: result.forestPlot.commune.key,
          code: result.forestPlot.commune.code,
          text: result.forestPlot.commune.text,
        },
        treeSpec: result.forestPlot.treeSpec && {
          id: result.forestPlot.treeSpec.id,
          name: result.forestPlot.treeSpec.name,
          acronym: result.forestPlot.treeSpec.acronym,
          latin: result.forestPlot.treeSpec.latin,
          geoDistribution: result.forestPlot.treeSpec.geoDistribution,
          isSpecialProduct: result.forestPlot.treeSpec.isSpecialProduct,
        },
        volumnPerPlot: result.forestPlot.volumnPerPlot,
        area: result.forestPlot.area,
        compartment: result.forestPlot.compartment && {
          key: result.forestPlot.compartment.key,
          code: result.forestPlot.compartment.code,
          text: result.forestPlot.compartment.text,
        },
        subCompartment: result.forestPlot.subCompartment && {
          key: result.forestPlot.subCompartment.key,
          code: result.forestPlot.subCompartment.code,
          text: result.forestPlot.subCompartment.text,
        },
        plotCode: result.forestPlot.plotCode,
      },
      contactName: result.contactName,
      contactPhone: result.contactPhone,
      note: result.note,
    };
  }

  // Chi tiết chủ rừng theo lô
  viewActorForForestplot(actorId: number, forestPlotId: number) {
    const url = `actor/forestplot/${forestPlotId}/${actorId}`;
    return this.apiService.get(url).map(response => {
      return this.mappingActorToForesplot(response.result);
    });
  }

  reviewActor(reviewContent: CreateActorReview): Observable<ActorReviewModel> {
    const url = `actor/review/create`;
    return this.apiService.post(url, reviewContent).map(res => {
      const result = res.result;
      return {
        id: result.id,
        actor: result.actor && {
          id: result.actor.id,
          name: result.actor.name,
          email: result.actor.email,
          phone: result.actor.phone,
          website: result.actor.website,
          avatar: result.avatar && {
            guid: result.avatar.guid,
            thumbSizeUrl: result.avatar.thumbSizeUrl,
            largeSizeUrl: result.avatar.largeSizeUrl,
          },
          averageRating: result.actor.averageRating,
          aggregateOfRatings: (result.actor.aggregateOfRatings || []).map(rating => ({
            key: rating.key,
            code: rating.code,
            text: rating.text,
          })),
        },
        reviewUser: result.reviewUser && {
          id: result.reviewUser.id,
          email: result.reviewUser.email,
          type: result.reviewUser.type && {
            key: result.reviewUser.type.key,
            code: result.reviewUser.type.code,
            text: result.reviewUser.type.text,
          },
          organizationName: result.reviewUser.organizationName,
          acronymName: result.reviewUser.acronymName,
          phone: result.reviewUser.phone,
          stateProvince: result.reviewUser.stateProvince && {
            key: result.reviewUser.stateProvince.key,
            code: result.reviewUser.stateProvince.code,
            text: result.reviewUser.stateProvince.text,
          },
          district: result.reviewUser.district && {
            key: result.reviewUser.district.key,
            code: result.reviewUser.district.code,
            text: result.reviewUser.district.text,
          },
          commune: result.reviewUser.commune && {
            key: result.reviewUser.commune.key,
            code: result.reviewUser.commune.code,
            text: result.reviewUser.commune.text,
          },
          status: result.reviewUser.status && {
            key: result.reviewUser.status.key,
            code: result.reviewUser.status.code,
            text: result.reviewUser.status.text,
          },
          avatar: result.reviewUser.avatar && {
            guid: result.reviewUser.avatar.guid,
            thumbSizeUrl: result.reviewUser.avatar.thumbSizeUrl,
            largeSizeUrl: result.reviewUser.avatar.largeSizeUrl,
          },
        },
        rating: result.rating,
        title: result.title,
        content: result.content,
        reviewDate: result.reviewDate,
        hidden: result.hidden,
        forestPlotId: result.forestPlotId,
      };
    });
  }

  // Danh sách review của lô rừng
  // tslint:disable-next-line:max-line-length
  getListReviewActor(actorId: number, forestPlotId: number, page: number | string, pageSize: number | string): Observable<PagedResultActorForestList<ActorReviewModel>> {
    const url = `forestplot/${forestPlotId}/${actorId}/review/${page}/${pageSize}`;
    return this.apiService.get(url).map(response => {
      const result = response.result;
      return {
        extraData: result.extraData && {
          reviewCount: result.extraData.reviewCount,
          isUserReview: result.extraData.isUserReview,
        },
        currentPage: result.pageIndex,
        pageSize: result.pageSize,
        pageCount: result.totalPages,
        total: result.totalCount,
        items: (result.items || []).map(item => {
          return {
            id: item.id,
            actor: item.actor && {
              id: item.actor.id,
              name: item.actor.name,
              email: item.actor.email,
              phone: item.actor.phone,
              website: item.actor.website,
              avatar: item.avatar && {
                guid: item.avatar.guid,
                thumbSizeUrl: item.avatar.thumbSizeUrl,
                largeSizeUrl: item.avatar.largeSizeUrl,
              },
              averageRating: item.averageRating,
              aggregateOfRatings: (item.aggregateOfRatings || []).map(rating => ({
                key: rating.key,
                code: rating.code,
                text: rating.text,
              })),
            },
            reviewUser: item.reviewUser && {
              id: item.reviewUser.id,
              email: item.reviewUser.email,
              type: item.reviewUser.type && {
                key: item.reviewUser.type.key,
                code: item.reviewUser.type.code,
                text: item.reviewUser.type.text,
              },
              organizationName: item.reviewUser.organizationName,
              acronymName: item.reviewUser.acronymName,
              phone: item.reviewUser.phone,
              stateProvince: item.reviewUser.stateProvince && {
                key: item.reviewUser.stateProvince.key,
                code: item.reviewUser.stateProvince.code,
                text: item.reviewUser.stateProvince.text,
              },
              district: item.reviewUser.district && {
                key: item.reviewUser.district.key,
                code: item.reviewUser.district.code,
                text: item.reviewUser.district.text,
              },
              commune: item.reviewUser.commune && {
                key: item.reviewUser.commune.key,
                code: item.reviewUser.commune.code,
                text: item.reviewUser.commune.text,
              },
              status: item.reviewUser.status && {
                key: item.reviewUser.status.key,
                code: item.reviewUser.status.code,
                text: item.reviewUser.status.text,
              },
              avatar: item.reviewUser.avatar && {
                guid: item.reviewUser.avatar.guid,
                thumbSizeUrl: item.reviewUser.avatar.thumbSizeUrl,
                largeSizeUrl: item.reviewUser.avatar.largeSizeUrl,
              },
            },
            rating: item.rating,
            title: item.title,
            content: item.content,
            reviewDate: item.reviewDate,
          };
        }),
      };
    });
  }

  // Danh sách review của lô rừng - Admin
  // tslint:disable-next-line:max-line-length
  getListReviewActorAdmin( actorId: number, forestPlotId: number, page: number | string, pageSize: number | string): Observable<PagedResult<ActorReviewModel>> {
    const url = `admin/forestplot/${forestPlotId}/${actorId}/reviews/${page}/${pageSize}`;
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
            actor: item.actor && {
              id: item.actor.id,
              name: item.actor.name,
              email: item.actor.email,
              phone: item.actor.phone,
              website: item.actor.website,
              avatar: item.avatar && {
                guid: item.avatar.guid,
                thumbSizeUrl: item.avatar.thumbSizeUrl,
                largeSizeUrl: item.avatar.largeSizeUrl,
              },
              averageRating: item.averageRating,
              aggregateOfRatings: (item.aggregateOfRatings || []).map(rating => ({
                key: rating.key,
                code: rating.code,
                text: rating.text,
              })),
            },
            reviewUser: item.reviewUser && {
              id: item.reviewUser.id,
              email: item.reviewUser.email,
              type: item.reviewUser.type && {
                key: item.reviewUser.type.key,
                code: item.reviewUser.type.code,
                text: item.reviewUser.type.text,
              },
              organizationName: item.reviewUser.organizationName,
              acronymName: item.reviewUser.acronymName,
              phone: item.reviewUser.phone,
              stateProvince: item.reviewUser.stateProvince && {
                key: item.reviewUser.stateProvince.key,
                code: item.reviewUser.stateProvince.code,
                text: item.reviewUser.stateProvince.text,
              },
              district: item.reviewUser.district && {
                key: item.reviewUser.district.key,
                code: item.reviewUser.district.code,
                text: item.reviewUser.district.text,
              },
              commune: item.reviewUser.commune && {
                key: item.reviewUser.commune.key,
                code: item.reviewUser.commune.code,
                text: item.reviewUser.commune.text,
              },
              status: item.reviewUser.status && {
                key: item.reviewUser.status.key,
                code: item.reviewUser.status.code,
                text: item.reviewUser.status.text,
              },
              avatar: item.reviewUser.avatar && {
                guid: item.reviewUser.avatar.guid,
                thumbSizeUrl: item.reviewUser.avatar.thumbSizeUrl,
                largeSizeUrl: item.reviewUser.avatar.largeSizeUrl,
              },
            },
            rating: item.rating,
            title: item.title,
            content: item.content,
            reviewDate: item.reviewDate,
            hidden: item.hidden,
          };
        }),
      };
    });
  }

  // Danh sách tuổi của loài cây (theo xã và nhóm loài cây)
  getYearoldsTree(treeSpecID: number, communeId: number): Observable<number[]> {
    let url = '';
    if (treeSpecID && treeSpecID !== 0) {
      url = `forestplot/detail/yearolds?treespecId=${treeSpecID}&communeId=${communeId}`;
    } else {
      url = `forestplot/detail/yearolds?treespecId=&communeId=${communeId}`;
    }
    return this.apiService.get(url).map(response => {
      return response.result;
    });
  }

  // ====================================
  // Đánh giá liên hệ
  // Tạo mới đánh giá liên hệ
  createReviewContact(createContactReview: CreateContactReview) {
    const url = `contact/review/create`;
    return this.apiService.post(url, createContactReview).map(response => {
      return this.mappingListReviewContact(response.result);
    });
  }

  // Mapping model danh sách đánh giá của liên hệ gián tiếp
  mappingListReviewContact(result: any): ReviewContactList {
    return {
      id: result.id,
      contact: result.contact ? {
        id: result.contact.id,
        contributor: result.contact.contributor,
        titleContribute: result.contact.titleContribute,
        contactType: result.contact.contactType ? {
          key: result.contact.contactType.key,
          code: result.contact.contactType.code,
          text: result.contact.contactType.text,
        } : null,
        userType: result.contact.userType ? {
          key: result.contact.userType.key,
          code: result.contact.userType.code,
          text: result.contact.userType.text,
        } : null,
        contactName: result.contact.contactName,
        acronymName: result.contact.acronymName,
        detail: result.contact.detail,
        userContact: result.contact.userContact,
        phone1: result.contact.phone1,
        phone2: result.contact.phone2,
        email: result.contact.email,
        website: result.contact.website,
        note: result.contact.note,
        images: result.contact.images ? result.contact.images.map(item => {
          return {
            guid: item.guid,
            thumbSizeUrl: item.thumbSizeUrl,
            largeSizeUrl: item.largeSizeUrl,
          };
        }) : null,
        stateProvince: result.contact.stateProvince ? {
          key: result.contact.stateProvince.key,
          code: result.contact.stateProvince.code,
          text: result.contact.stateProvince.text,
        } : null,
        district: result.contact.district ? {
          key: result.contact.district.key,
          code: result.contact.district.code,
          text: result.contact.district.text,
        } : null,
        commune: result.contact.commune ? {
          key: result.contact.commune.key,
          code: result.contact.commune.code,
          text: result.contact.commune.text,
        } : null,
        houseNumber: result.contact.houseNumber,
        address: result.contact.address,
        averageRating: result.contact.averageRating,
        aggregateOfRatings: result.contact.aggregateOfRatings ? (result.contact.aggregateOfRatings || []).map(item => {
          return {
            rating: item.rating,
            percent: item.percent,
          };
        }) : null,
        locationInCharge: result.contact.locationInCharge && (result.contact.locationInCharge || []).map(item => {
          return {
            stateProvince: item.stateProvince && {
              key: item.stateProvince.key,
              code: item.stateProvince.code,
              text: item.stateProvince.text,
            },
            district: item.district && {
              key: item.district.key,
              code: item.district.code,
              text: item.district.text,
            },
            commune: item.commune && {
              key: item.commune.key,
              code: item.commune.code,
              text: item.commune.text,
            },
          };
        }),
        status: result.contact.status && {
          key: result.contact.status.key,
          code: result.contact.status.code,
          text: result.contact.status.text,
        },
      } : null,
      reviewUser: result.reviewUser ? {
        id: result.reviewUser.id,
        email: result.reviewUser.email,
        type: result.reviewUser.type ? {
          key: result.reviewUser.type.key,
          code: result.reviewUser.type.code,
          text: result.reviewUser.type.text,
        } : null,
        organizationName: result.reviewUser.organizationName,
        acronymName: result.reviewUser.acronymName,
        phone: result.reviewUser.phone,
        avatar: result.reviewUser.avatar ? {
          guid: result.reviewUser.avatar.guid,
          thumbSizeUrl: result.reviewUser.avatar.thumbSizeUrl,
          largeSizeUrl: result.reviewUser.avatar.largeSizeUrl,
        } : null,
        stateProvince: result.reviewUser.stateProvince ? {
          key: result.reviewUser.stateProvince.key,
          code: result.reviewUser.stateProvince.code,
          text: result.reviewUser.stateProvince.text,
        } : null,
        district: result.reviewUser.district ? {
          key: result.reviewUser.district.key,
          code: result.reviewUser.district.code,
          text: result.reviewUser.district.text,
        } : null,
        commune: result.reviewUser.commune ? {
          key: result.reviewUser.commune.key,
          code: result.reviewUser.commune.code,
          text: result.reviewUser.commune.text,
        } : null,
        status: result.reviewUser.status ? {
          key: result.reviewUser.status.key,
          code: result.reviewUser.status.code,
          text: result.reviewUser.status.text,
        } : null,
      } : null,
      rating: result.rating,
      title: result.title,
      content: result.content,
      reviewDate: result.reviewDate,
      hidden: result.hidden,
    };
  }

  // Danh sách đánh giá của liên hệ gián tiếp
  // tslint:disable-next-line:max-line-length
  getListReviewContact(contactId: number, page: number | string, pageSize: number | string): Observable<PagedResultContactList<ReviewContactList>> {
    const url = `contact/${contactId}/reviews/${page}/${pageSize}`;
    return this.apiService.get(url).map(response => {
      const result = response.result;
      return {
        currentPage: result.pageIndex,
        pageSize: result.pageSize,
        pageCount: result.totalPages,
        total: result.totalCount,
        items: (result.items || []).map(this.mappingListReviewContact),
        extraData: result.extraData && {
          reviewCount: result.extraData.reviewCount,
          isUserReview: result.extraData.isUserReview,
        },
      };
    });
  }

  // Danh sách đánh giá của liên hệ gián tiếp của Admin
  // tslint:disable-next-line:max-line-length
  getListReviewContactAdmin(contactId: number, page: number | string, pageSize: number | string): Observable<PagedResultContactList<ReviewContactList>> {
    const url = `admin/contact/${contactId}/reviews/${page}/${pageSize}`;
    return this.apiService.get(url).map(response => {
      const result = response.result;
      return {
        currentPage: result.pageIndex,
        pageSize: result.pageSize,
        pageCount: result.totalPages,
        total: result.totalCount,
        items: (result.items || []).map(this.mappingListReviewContact),
        extraData: result.extraData && {
          reviewCount: result.extraData.reviewCount,
          isUserReview: result.extraData.isUserReview,
        },
      };
    });
  }
}
