import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';
import { FilterEvaluateContactListManager } from '../../model/evaluate-contact/filter-evaluate-contact-list-manager.model';
import { ReviewContactList } from '../../model/contact/review-contact-list.model';
import { ApiService } from '../api.service';
import { PagedResult } from '../../model/dictionary/paging-result.model';
import { ListEvaluateContact } from '../../model/evaluate-contact/list-evaluate-contact.model';
import { EvaluateActorFilterManager } from '../../model/evaluate-actor/evaluate-actor-filter-manager.model';
import { EvaluateActorListManager } from '../../model/evaluate-actor/evaluate-actor-list-manager.model';
import { DetailActorManagerForest } from '../../model/evaluate-actor/detail-actor-manager-forest.model';

@Injectable({
  providedIn: 'root',
})
export class ManageEvaluateService {
  filterModelListContact = new FilterEvaluateContactListManager();
  currentPageContact = null;
  pageSizeContact = null;
  searchTermActor = null;
  filterModelListActor = new EvaluateActorFilterManager();
  currentPageActor = null;
  pageSizeActor = null;
  constructor(
    private apiService: ApiService,
  ) {
    this.filterModelListContact = null;
    this.filterModelListActor = null;
  }
  // Create param url cho Danh sách đánh giá liên hệ gián tiếp
  createFilterParamsListReviewContact(filterModel: FilterEvaluateContactListManager): URLSearchParams {
    const urlFilterParams = new URLSearchParams();
    urlFilterParams.append(
      'contactStateProvinceId',
      filterModel.contactStateProvinceId ? filterModel.contactStateProvinceId.toString() : '',
    );
    urlFilterParams.append(
      'contactDistrictId',
      filterModel.contactDistrictId ? filterModel.contactDistrictId.toString() : '',
    );
    urlFilterParams.append(
      'contactCommuneId',
      filterModel.contactCommuneId ? filterModel.contactCommuneId.toString() : '',
    );
    urlFilterParams.append(
      'rating',
      filterModel.rating ? filterModel.rating.toString() : '',
    );
    return urlFilterParams;
  }

  // Mapping model Danh sách đánh giá liên hệ gián tiếp
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

  // Danh sách đánh giá liên hệ gián tiếp
  evaluateList(
    filterModel: FilterEvaluateContactListManager,
    page: number | string,
    pageSize: number | string,
  ): Observable<PagedResult<ReviewContactList>> {
    const url = `contactreviews/${page}/${pageSize}`;
    const urlParams = this.createFilterParamsListReviewContact(filterModel);
    return this.apiService.get(url, urlParams).map(response => {
      const result = response.result;
      return {
        currentPage: result.pageIndex,
        pageSize: result.pageSize,
        pageCount: result.totalPages,
        total: result.totalCount,
        items: (result.items || []).map(this.mappingListReviewContact),
      };
    });
  }

  // Mapping model to Danh sách liên hệ gián tiếp (màn hình quản lí đánh giá liên hệ gián tiếp)
  mappingContactListForEvaluate(result: any): ListEvaluateContact {
    return {
      id: result.id,
      contactName: result.contactName,
      userContact: result.userContact,
      phone1: result.phone1,
      contributor: result.contributor ? {
        id: result.contributor.id,
        email: result.contributor.email,
        type: result.contributor.type ? {
          key: result.contributor.type.key,
          code: result.contributor.type.code,
          text: result.contributor.type.text,
        } : null,
        organizationName: result.contributor.organizationName,
        acronymName: result.contributor.acronymName,
        phone: result.contributor.phone,
        avatar: result.contributor.avatar ? {
          guid: result.contributor.avatar.guid,
          thumbSizeUrl: result.contributor.avatar.thumbSizeUrl,
          largeSizeUrl: result.contributor.avatar.largeSizeUrl,
        } : null,
        stateProvince: result.contributor.stateProvince ? {
          key: result.contributor.stateProvince.key,
          code: result.contributor.stateProvince.code,
          text: result.contributor.stateProvince.text,
        } : null,
        district: result.contributor.district ? {
          key: result.contributor.district.key,
          code: result.contributor.district.code,
          text: result.contributor.district.text,
        } : null,
        commune: result.contributor.commune ? {
          key: result.contributor.commune.key,
          code: result.contributor.commune.code,
          text: result.contributor.commune.text,
        } : null,
        status: result.contributor.status ? {
          key: result.contributor.status.key,
          code: result.contributor.status.code,
          text: result.contributor.status.text,
        } : null,
      } : null,
      contributeDate: result.contributeDate,
      evalution: result.evalution,
      email: result.email,
      status: result.status ? {
        key: result.status.key,
        code: result.status.code,
        text: result.status.text,
      } : null,
      averageRating: result.averageRating,
      aggregateOfRatings: result.aggregateOfRatings ? (result.aggregateOfRatings || []).map(item => {
        return {
          rating: item.rating,
          percent: item.percent,
        };
      }) : null,
      titleContribute: result.titleContribute,
      reviewCount: result.reviewCount,
    };
  }


  // Create param url cho Danh sách liên hệ gián tiếp (màn hình quản lí đánh giá liên hệ gián tiếp)
  createFilterParamsContactListForEvaluate(filterModel: FilterEvaluateContactListManager): URLSearchParams {
    const urlFilterParams = new URLSearchParams();
    urlFilterParams.append(
      'contactStateProvinceId',
      filterModel.contactStateProvinceId ? filterModel.contactStateProvinceId.toString() : '',
    );
    urlFilterParams.append(
      'contactDistrictId',
      filterModel.contactDistrictId ? filterModel.contactDistrictId.toString() : '',
    );
    urlFilterParams.append(
      'contactCommuneId',
      filterModel.contactCommuneId ? filterModel.contactCommuneId.toString() : '',
    );
    urlFilterParams.append(
      'rating',
      filterModel.rating ? filterModel.rating.toString() : '',
    );
    return urlFilterParams;
  }


  // Danh sách liên hệ gián tiếp (màn hình quản lí đánh giá liên hệ gián tiếp)
  contactListForEvaluate(
    filterModel: FilterEvaluateContactListManager,
    page: number | string,
    pageSize: number | string,
  ): Observable<PagedResult<ListEvaluateContact>> {
    const url = `contact/filter/${page}/${pageSize}`;
    const urlParams = this.createFilterParamsContactListForEvaluate(filterModel);
    return this.apiService.get(url, urlParams).map(response => {
      const result = response.result;
      return {
        currentPage: result.pageIndex,
        pageSize: result.pageSize,
        pageCount: result.totalPages,
        total: result.totalCount,
        items: (result.items || []).map(this.mappingContactListForEvaluate),
      };
    });
  }

  // Danh sách đánh giá của 1 liên hệ gián tiếp
  listEvaluateFromContact(
    contactId: number,
    page: number | string,
    pageSize: number | string,
  ): Observable<PagedResult<ReviewContactList>> {
    const url = `contact/${contactId}/reviews/${page}/${pageSize}`;
    return this.apiService.get(url).map(response => {
      const result = response.result;
      return {
        currentPage: result.pageIndex,
        pageSize: result.pageSize,
        pageCount: result.totalPages,
        total: result.totalCount,
        items: (result.items || []).map(this.mappingListReviewContact),
      };
    });
  }

  // Xóa một đánh giá liên hệ gián tiếp
  deleteEvaluate(contactReviewId: number) {
    const url = `contact/review/${contactReviewId}/delete`;
    return this.apiService.post(url);
  }

  // Ẩn một đánh giá liên hệ gián tiếp
  hideEvaluate(contactReviewId: number) {
    const url = `contact/review/${contactReviewId}/hide`;
    return this.apiService.post(url);
  }

  // Hiện một đánh giá liên hệ gián tiếp
  showEvaluate(contactReviewId: number) {
    const url = `contact/review/${contactReviewId}/show`;
    return this.apiService.post(url);
  }

  // Xóa một đánh giá chủ rừng
  deleteEvaluateActor(actorReviewId: number) {
    const url = `actor/review/${actorReviewId}/delete`;
    return this.apiService.post(url);
  }

  // Ẩn một đánh giá chủ rừng
  hideEvaluateActor(actorReviewId: number) {
    const url = `actor/review/${actorReviewId}/hide`;
    return this.apiService.post(url);
  }

  // Hiện một đánh giá chủ rừng
  showEvaluateActor(actorReviewId: number) {
    const url = `actor/review/${actorReviewId}/show`;
    return this.apiService.post(url);
  }


  // ===============================
  // Chủ rừng
  // create params cho danh sách đánh giá chủ rừng theo lô
  createFilterParamsActorForEvaluate(filterModel: EvaluateActorFilterManager): URLSearchParams {
    const urlFilterParams = new URLSearchParams();
    urlFilterParams.append(
      'stateProvinceId',
      filterModel.stateProvinceId ? filterModel.stateProvinceId.toString() : '',
    );
    urlFilterParams.append(
      'districtId',
      filterModel.districtId ? filterModel.districtId.toString() : '',
    );
    urlFilterParams.append(
      'communeId',
      filterModel.communeId ? filterModel.communeId.toString() : '',
    );
    urlFilterParams.append(
      'compartmentId',
      filterModel.compartmentId ? filterModel.compartmentId.toString() : '',
    );
    urlFilterParams.append(
      'subCompartmentId',
      filterModel.subCompartmentId ? filterModel.subCompartmentId.toString() : '',
    );
    urlFilterParams.append(
      'plotCode',
      filterModel.plotCode ? filterModel.plotCode.toString() : '',
    );
    return urlFilterParams;
  }
  // Mapping cho danh sách đánh giá chủ rừng theo lô
  mappingActorForEvaluate(result: any): EvaluateActorListManager {
    return {
      name: result.name,
      forestPlot: result.forestPlot && {
        id: result.forestPlot.id,
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
          checked: result.forestPlot.treeSpec.checked,
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
      reviewCount: result.reviewCount,
      averageRating: result.averageRating,
    };
  }
  // Danh sách đánh giá chủ rừng theo lô
  actorListForEvaluate(
    searchTerm: string,
    filterModel: EvaluateActorFilterManager,
    page: number | string,
    pageSize: number | string,
  ): Observable<PagedResult<EvaluateActorListManager>> {
    const url = `forestplotactor/filter/${page}/${pageSize}?searchTerm=${searchTerm}`;
    const urlParams = this.createFilterParamsActorForEvaluate(filterModel);
    return this.apiService.get(url, urlParams).map(response => {
      const result = response.result;
      return {
        currentPage: result.pageIndex,
        pageSize: result.pageSize,
        pageCount: result.totalPages,
        total: result.totalCount,
        items: (result.items || []).map(this.mappingActorForEvaluate),
      };
    });
  }
  // Danh sách đánh giá chủ rừng theo lô màn hình Admin có search
  actorListForEvaluateSearchKeyWord(
    searchTerm: Observable<string>,
    filterModel: EvaluateActorFilterManager,
    page: number | string,
    pageSize: number | string,
  ): Observable<PagedResult<EvaluateActorListManager>> {
    const filterUrl = `forestplotactor/filter/${page}/${pageSize}?searchTerm=`;
    return searchTerm
      .debounceTime(600)
      .distinctUntilChanged()
      .switchMap(term => {
        const urlParams = this.createFilterParamsActorForEvaluate(filterModel);
        return this.apiService.get(filterUrl + term, urlParams).map(response => {
          const result = response.result;
          return {
            currentPage: result.pageIndex,
            pageSize: result.pageSize,
            pageCount: result.totalPages,
            total: result.totalCount,
            items: (result.items || []).map(this.mappingActorForEvaluate),
          };
        });
      });

  }
  // mapping Chi tiết chủ rừng theo lô
  mappingDetailAtorForForestPlotId(result: any): DetailActorManagerForest {
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
      roles: result.roles ? (result.roles || []).map(itemrRole => {
        return {
          key: itemrRole.key,
          code: itemrRole.code,
          text: itemrRole.text,
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
      aggregateOfRatings: result.aggregateOfRatings ? (result.aggregateOfRatings || []).map(itemAggregateOfRating => {
        return {
          rating: itemAggregateOfRating.rating,
          percent: itemAggregateOfRating.percent,
        };
      }) : null,
      reviews: result.reviews ? (result.reviews || []).map(itemReview => {
        return {
          id: itemReview.id,
          reviewUser: itemReview.reviewUser && {
            id: itemReview.reviewUser.id,
            email: itemReview.reviewUser.email,
            type: itemReview.reviewUser.type && {
              key: itemReview.reviewUser.type.key,
              code: itemReview.reviewUser.type.code,
              text: itemReview.reviewUser.type.text,
            },
            organizationName: itemReview.organizationName,
            acronymName: itemReview.acronymName,
            phone: itemReview.phone,
            avatar: itemReview.avatar && {
              guid: itemReview.avatar.guid,
              thumbSizeUrl: itemReview.avatar.thumbSizeUrl,
              largeSizeUrl: itemReview.avatar.largeSizeUrl,
            },
            stateProvince: itemReview.stateProvince && {
              key: itemReview.stateProvince.key,
              code: itemReview.stateProvince.code,
              text: itemReview.stateProvince.text,
            },
            district: itemReview.district && {
              key: itemReview.district.key,
              code: itemReview.district.code,
              text: itemReview.district.text,
            },
            commune: itemReview.commune && {
              key: itemReview.commune.key,
              code: itemReview.commune.code,
              text: itemReview.commune.text,
            },
            status: itemReview.status && {
              key: itemReview.status.key,
              code: itemReview.status.code,
              text: itemReview.status.text,
            },
          },
          rating: itemReview.rating,
          title: itemReview.title,
          content: itemReview.content,
          reviewDate: itemReview.reviewDate,
          forestPlot: itemReview.forestPlot && {
            id: itemReview.forestPlot.id,
            treeSpec: itemReview.forestPlot.treeSpec && {
              id: itemReview.forestPlot.treeSpec.id,
              name: itemReview.forestPlot.treeSpec.name,
              acronym: itemReview.forestPlot.treeSpec.acronym,
              latin: itemReview.forestPlot.treeSpec.latin,
              geoDistribution: itemReview.forestPlot.treeSpec.geoDistribution,
              isSpecialProduct: itemReview.forestPlot.treeSpec.isSpecialProduct,
            },
            compartment: itemReview.forestPlot.compartment && {
              key: itemReview.forestPlot.compartment.key,
              code: itemReview.forestPlot.compartment.code,
              text: itemReview.forestPlot.compartment.text,
            },
            subCompartment: itemReview.forestPlot.subCompartment && {
              key: itemReview.forestPlot.subCompartment.key,
              code: itemReview.forestPlot.subCompartment.code,
              text: itemReview.forestPlot.subCompartment.text,
            },
            plot: itemReview.forestPlot.plot && {
              key: itemReview.forestPlot.plot.key,
              code: itemReview.forestPlot.plot.code,
              text: itemReview.forestPlot.plot.text,
            },
            volumnPerPlot: itemReview.forestPlot.volumnPerPlot,
            area: itemReview.forestPlot.area,
            plantingYear: itemReview.forestPlot.plantingYear,
            actorType: itemReview.forestPlot.actorType && {
              id: itemReview.forestPlot.actorType.id,
              name: itemReview.forestPlot.actorType.name,
              code: itemReview.forestPlot.actorType.code,
              acronymName: itemReview.forestPlot.actorType.acronymName,
            },
            forestCert: itemReview.forestPlot.forestCert && {
              key: itemReview.forestPlot.forestCert.key,
              code: itemReview.forestPlot.forestCert.code,
              text: itemReview.forestPlot.forestCert.text,
            },
            reliability: itemReview.forestPlot.reliability && {
              key: itemReview.forestPlot.reliability.key,
              code: itemReview.forestPlot.reliability.code,
              text: itemReview.forestPlot.reliability.text,
            },
            compartmentCode: itemReview.compartmentCode,
            subCompartmentCode: itemReview.subCompartmentCode,
            plotCode: itemReview.plotCode,
          },

        };
      }) : null,
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
  detailAtorForForestPlotId(forestPlotId: number): Observable<DetailActorManagerForest> {
    const url = `actor/forestplot/${forestPlotId}`;
    return this.apiService.get(url).map(response => {
      const result = response.result;
      return this.mappingDetailAtorForForestPlotId(result);
    });
  }

}
