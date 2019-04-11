import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { PagedResult } from '../model/dictionary/paging-result.model';
import { ContactDetail } from '../model/contact/contact-detail.model';
import { ContactList } from '../model/contact/contact-list.model';
import { ContactListAll } from '../model/contact/contact-list-all.model';
import { Image } from '../model/dictionary/image.model';
import { OverviewForest } from '../model/overview-forest.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(
    private apiService: ApiService
  ) { }
  // mapping chi tiết liên hệ
  mappingDetailContact(result: any): ContactDetail {
    return {
      id: result.id,
      contributor: result.contributor,
      titleContribute: result.titleContribute,
      contactType: result.contactType ? {
        key: result.contactType.key,
        code: result.contactType.code,
        text: result.contactType.text,
      } : null,
      userType: result.userType ? {
        key: result.userType.key,
        code: result.userType.code,
        text: result.userType.text
      } : null,
      contactName: result.contactName,
      acronymName: result.acronymName,
      detail: result.detail,
      userContact: result.userContact,
      phone1: result.phone1,
      phone2: result.phone2,
      email: result.email,
      website: result.website,
      note: result.note,
      images: result.images ? (result.images || []).map(itemImage => {
        return {
          guid: itemImage.guid,
          thumbSizeUrl: itemImage.thumbSizeUrl,
          largeSizeUrl: itemImage.largeSizeUrl,
        }
      }) : null,
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
      houseNumber: result.houseNumber,
      address: result.address,
      averageRating: result.averageRating,
      aggregateOfRatings: result.aggregateOfRatings ? (result.aggregateOfRatings || []).map(item => {
        return {
          rating: item.rating,
          percent: item.percent,
        }
      }) : null,
      locationInCharge: result.locationInCharge && (result.locationInCharge || []).map(item => {
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
          }
        }
      })
    }
  }
  // Chi tiết liên hệ
  detailContact(
    contactId: number,
  ): Observable<ContactDetail> {
    const url = `contact/${contactId}`;
    return this.apiService.get(url).map(response => {
      const result = response.result;
      return this.mappingDetailContact(result);
    });
  }
  // mapping theo model của danh sách liên hệ
  mappingListContact(result: any): ContactList {
    return {
      id: result.id,
      contactName: result.contactName,
      userContact: result.userContact,
      phone1: result.phone1,
      contributor: result.contributor && {
        id: result.contributor.id,
        email: result.contributor.email,
        type: result.contributor.type && {
          key: result.contributor.type.key,
          code: result.contributor.type.code,
          text: result.contributor.type.text,
        },
        organizationName: result.contributor.organizationName,
        acronymName: result.contributor.acronymName,
        phone: result.contributor.phone,
        avatar: result.contributor.avatar && {
          guid: result.contributor.avatar.guid,
          thumbSizeUrl: result.contributor.avatar.thumbSizeUrl,
          largeSizeUrl: result.contributor.avatar.largeSizeUrl,
        },
        stateProvince: result.contributor.stateProvince && {
          key: result.contributor.stateProvince.key,
          code: result.contributor.stateProvince.code,
          text: result.contributor.stateProvince.text,
        },
        district: result.contributor.district && {
          key: result.contributor.district.key,
          code: result.contributor.district.code,
          text: result.contributor.district.text,
        },
        commune: result.contributor.commune && {
          key: result.contributor.commune.key,
          code: result.contributor.commune.code,
          text: result.contributor.commune.text,
        },
        status: result.contributor.status && {
          key: result.contributor.status.key,
          code: result.contributor.status.code,
          text: result.contributor.status.text,
        },
      },
      contributeDate: result.contributeDate,
      evalution: result.evalution,
      email: result.email,
      status: result.status ? {
        key: result.status.key,
        code: result.status.code,
        text: result.status.text,
      } : null,
      averageRating: result.averageRating,
      aggregateOfRatings: result.aggregateOfRatings ? result.aggregateOfRatings.map(item => {
        return {
          rating: item.rating,
          percent: item.percent,
        }
      }) : null,
    }
  }
  // Danh sách liên hệ
  listContact(
    communeId: string,
    page: number,
    ppageSize: number
  ): Observable<ContactListAll> {
    const url = `commune/${communeId}/contact/${page}/${ppageSize}`;
    return this.apiService.get(url).map(response => {
      const result = response.result;
      return {
        contacts: result.contacts ? {
          currentPage: result.contacts.pageIndex,
          pageSize: result.contacts.pageSize,
          pageCount: result.contacts.totalPages,
          total: result.contacts.totalCount,
          items: (result.contacts.items || []).map(this.mappingListContact)
        } : null,
        ubnd: result.ubnd,
        forestProtectionDepartment: result.forestProtectionDepartment && {
          id: result.forestProtectionDepartment.id,
          name: result.forestProtectionDepartment.name,
          phone: result.forestProtectionDepartment.phone,
          district: result.forestProtectionDepartment.district && {
            key: result.forestProtectionDepartment.district.key,
            code: result.forestProtectionDepartment.district.code,
            text: result.forestProtectionDepartment.district.text,
          },
          stateProvince: result.forestProtectionDepartment.stateProvince && {
            key: result.forestProtectionDepartment.stateProvince.key,
            code: result.forestProtectionDepartment.stateProvince.code,
            text: result.forestProtectionDepartment.stateProvince.text,
          }
        },
      }
    });
  }
  // Xóa liên hệ
  deleteContact(contactId: number) {
    const url = `contact/${contactId}/delete`;
    return this.apiService.get(url);
  }
  // Tạo mới liên hệ
  createContact(contributor: string, detailsofTreeSpecies: OverviewForest, formVlaue: any, imageUrls: Image[]) {
    const url = `contact/create`;
    // let requestModel = new ContactDetail();
    const requestModel = {
      // forestPlotId: forestPlotId,
      contributor: contributor,
      titleContribute: formVlaue.titleContribute,
      contactTypeID: formVlaue.contactTypeID ? +formVlaue.contactTypeID : null,
      contactName: formVlaue.contactName,
      acronymName: formVlaue.acronymName,
      userContact: formVlaue.userContact,
      phone1: formVlaue.phone1,
      phone2: formVlaue.phone2,
      email: formVlaue.email,
      website: formVlaue.website,
      note: formVlaue.note,
      images: (imageUrls || []).map(item => {
        return (item && item.guid) ? item.guid : null;
      }),
      stateProvinceID: formVlaue.stateProvinceID ? +formVlaue.stateProvinceID : null,
      districtID: formVlaue.districtID ? +formVlaue.districtID : null,
      communeID: formVlaue.communeID ? +formVlaue.communeID : null,
      houseNumber: formVlaue.houseNumber,
      address: formVlaue.address,
      locationInCharges: (formVlaue.localitys || []).map(item => {
        return {
          forestStateProvinceID: item.stateProvinceID,
          forestDistrictID: item.districtID,
          forestCommuneID: item.communeID ? item.communeID : null,
        }
      })
    }
    return this.apiService.post(url, requestModel).map(response => {
      const result = response.result;
      return {
        currentPage: result.pageIndex,
        pageSize: result.pageSize,
        pageCount: result.totalPages,
        total: result.totalCount,
        items: (result.items || []).map(this.mappingDetailContact)
      }
    })
  }
  // Chỉnh sửa liên hệ
  editContact(contributor: string, idContact: number, formVlaue: any, imageUrls: Image[], detailsofTreeSpecies: OverviewForest) {
    const url = `contact/update`;
    // let requestModel = new ContactDetail();
    const requestModel = {
      id: idContact,
      contributor: contributor,
      titleContribute: formVlaue.titleContribute,
      contactTypeID: formVlaue.contactTypeID ? +formVlaue.contactTypeID : null,
      contactName: formVlaue.contactName,
      acronymName: formVlaue.acronymName,
      userContact: formVlaue.userContact,
      phone1: formVlaue.phone1,
      phone2: formVlaue.phone2,
      email: formVlaue.email,
      website: formVlaue.website,
      note: formVlaue.note,
      images: (imageUrls || []).map(item => {
        return (item && item.guid) ? item.guid : null;
      }),
      stateProvinceID: formVlaue.stateProvinceID ? +formVlaue.stateProvinceID : null,
      districtID: formVlaue.districtID ? +formVlaue.districtID : null,
      communeID: formVlaue.communeID ? +formVlaue.communeID : null,
      houseNumber: formVlaue.houseNumber,
      address: formVlaue.address,
      locationInCharges: (formVlaue.localitys || []).map(item => {
        return {
          forestStateProvinceID: item.stateProvinceID,
          forestDistrictID: item.districtID,
          forestCommuneID: item.communeID ? item.communeID : null,
        }
      })
    }
    return this.apiService.post(url, requestModel).map(response => {
      const result = response.result;
      return {
        currentPage: result.pageIndex,
        pageSize: result.pageSize,
        pageCount: result.totalPages,
        total: result.totalCount,
        items: (result.items || []).map(this.mappingDetailContact)
      }
    })
  }
  // Xóa nhiều liên hệ
  deleteMultipleContact(ids: number[]) {
    const url = `contact/multidelete`;
    // (ids || []).map(item => {
    // })
    // urlFilterParams.append(
    //   'stateProvinceID',
    //   filterModel.stateProvinceID ? filterModel.stateProvinceID.key.toString() : ''
    // );
    return this.apiService.post(url, ids);
  }

  // Chỉnh sửa trạng thái liên hệ 
  changeStatusContact(id: number, status: string) {
    const requestModel = {
      id: id,
      status: status
    }
    const url = `contact/changestatus`;
    return this.apiService.post(url, requestModel);
  }
}

