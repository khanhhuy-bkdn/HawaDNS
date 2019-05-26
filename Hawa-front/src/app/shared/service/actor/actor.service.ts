import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { Observable } from 'rxjs';
import { ActorReviewModel } from '../../model/actor/actor-review.model';

@Injectable({
  providedIn: 'root'
})
export class ActorService {

  constructor(
    private apiService: ApiService
  ) { }

  // mapping Chi tiết đánh giá chủ rừng đối với lô
  mappingDetailReviewActor(result: any): ActorReviewModel {
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
    }
  }

  // Chi tiết đánh giá chủ rừng đối với lô
  viewReviewActor(actorReviewId: number): Observable<ActorReviewModel> {
    const url = `actor/review/${actorReviewId}`;
    return this.apiService.get(url).map(reponse => {
      const result = reponse.result;
      return this.mappingDetailReviewActor(result);
    })
  }

  getAllActor() {
    const url = `actors`;
    return this.apiService.get(url).map(reponse => {
      const result = reponse.result;
      return result;
    });
  }
}
