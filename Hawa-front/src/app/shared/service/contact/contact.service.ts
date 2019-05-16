import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { ReviewItem } from '../../model/dictionary/review-item.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(
    private apiService: ApiService,
  ) { }

  // mapping Chi tiết đánh giá liên hệ gián tiếp
  // mappingReviewContact(result: any): ReviewItem {
  //   return {

  //   }
  // }

  // Chi tiết đánh giá liên hệ gián tiếp
  // viewReviewContact(contactReviewId: number): Observable<ReviewItem> {
  //   const url = `contact/review/${contactReviewId}`;
  //   return this.apiService.get(url).map(response => {
      
  //   })
  // }
}
