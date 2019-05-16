import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { Observable } from 'rxjs';
import { PagedResult } from '../../model/dictionary/paging-result.model';
import { NotificationItem } from '../../model/noitification/notification-item.model';
import { URLSearchParams } from '@angular/http';
import { NotificationFilter } from '../../model/noitification/notification-filter.model';
import DateTimeConvertHelper from '../../helpers/datetime-convert-helper';
@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private apiService: ApiService,
  ) { }

  // Tạo filterParam cho danh sách thông báo
  createFilterParamsNotifi(filterModel: NotificationFilter): URLSearchParams {
    const urlFilterParams = new URLSearchParams();
    if (filterModel.isRead !== null) {
      urlFilterParams.append(
        'isRead',
        filterModel.isRead.toString()
      );
    }
    urlFilterParams.append(
      'systemType',
      filterModel.systemType
    );
    if (filterModel.startDate) {
      urlFilterParams.append(
        'startDate',
        DateTimeConvertHelper.fromDtObjectToTimestamp(filterModel.startDate).toString()
      );
    }
    if (filterModel.endDate) {
      urlFilterParams.append(
        'endDate',
        DateTimeConvertHelper.fromDtObjectToTimestamp(filterModel.endDate).toString()
      );
    }

    return urlFilterParams;
  }

  // Mapping danh sách thông báo (lọc theo đọc/chưa đọc, SystemType)
  mappingItemNotification(result: any): NotificationItem {
    return {
      id: result.id,
      notificationContent: result.notificationContent,
      notificationType: result.notificationType,
      createdDate: result.createdDate,
      notificationObjectID: result.notificationObjectID,
      arNotificationRead: result.arNotificationRead,
      notificationObjectType: result.notificationObjectType,
      notificationPriority: result.notificationPriority,
      notificationSystemType: result.notificationSystemType && {
        key: result.notificationSystemType.key,
        code: result.notificationSystemType.code,
        text: result.notificationSystemType.text,
      }
    }
  }

  // Danh sách thông báo (lọc theo đọc/chưa đọc, SystemType)
  getNotificationList(page: number | string, pageSize: number | string, filterModel: NotificationFilter): Observable<PagedResult<NotificationItem>> {
    const url = `notification/filter/${page}/${pageSize}`;
    const urlParams = this.createFilterParamsNotifi(filterModel);
    return this.apiService.get(url, urlParams).map(response => {
      const result = response.result;
      return {
        currentPage: result.pageIndex,
        pageSize: result.pageSize,
        pageCount: result.totalPages,
        total: result.totalCount,
        items: (result.items || []).map(this.mappingItemNotification)
      }
    })
  }

  // Đã đọc thông báo
  readNotification(notificationId: number) {
    const url = `notification/${notificationId}/read`;
    return this.apiService.get(url);
  }

  // Xóa một thông báo
  deleteNotification(notificationId: number) {
    const url = `notification/${notificationId}/delete`;
    return this.apiService.post(url);
  }

  // Xóa nhiều thông báo
  deleteMutipleNotification(ids: number[]) {
    const url = `notification/multidelete`;
    const requestModel = {
      ids: ids,
    }
    return this.apiService.post(url, requestModel);
  }
}
