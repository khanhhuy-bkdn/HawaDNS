import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResult } from '../../model/dictionary/paging-result.model';
import { SystemFeedback } from '../../model/system-feedback/system-feedback.model';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class SystemFeedbackService {

  constructor(
    private apiService: ApiService
  ) { }

  getListFeedback(
    filter: string,
    page: number | string,
    pageSize: number | string
  ): Observable<PagedResult<SystemFeedback>> {
    let url = `feedback/${page}/${pageSize}`;
    if (filter !== '') {
      url = `${url}?isLike=${filter}`
    }
    return this.apiService.get(url).map(res => {
      const response = res.result;
      return {
        currentPage: response.pageIndex,
        pageSize: response.pageSize,
        pageCount: response.totalPages,
        total: response.totalCount,
        items: (response.items || []).map(item => ({
          id: item.id,
          isLike: item.isLike,
          date: item.date,
          content: item.content,
          user: item.user && {
            id: item.user.id,
            email: item.user.email,
            // type: {
            //   key: string,
            //   code: string,
            //   text: string
            // },
            organizationName: item.user.organizationName,
            acronymName: item.user.acronymName,
            phone: item.user.phone,
            avatar: item.user.avatar && {
              guid: item.user.avatar.guid,
              thumbSizeUrl: item.user.avatar.thumbSizeUrl,
              largeSizeUrl: item.user.avatar.largeSizeUrl
            },
            // stateProvince: {
            //   key: string,
            //   code: string,
            //   text: string
            // },
            // district: {
            //   key: string,
            //   code: string,
            //   text: string
            // },
            // commune: {
            //   key: string,
            //   code: string,
            //   text: string
            // },
            status: item.user.status && {
              key: item.user.status.key,
              code: item.user.status.code,
              text: item.user.status.text
            }
          }
        }))
      }
    })
  }
  deteleFeedback(feedbackId) {
    const url = `feedback/${feedbackId}/delete`;
    return this.apiService.post(url).map(res => res)
  }
}
