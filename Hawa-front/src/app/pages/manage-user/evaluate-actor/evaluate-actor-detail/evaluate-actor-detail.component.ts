import { Component, OnInit } from '@angular/core';
import { Subscription, forkJoin } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ManageEvaluateService } from '../../../../shared/service/manage-user-account/manage-evaluate.service';
import { PagedResult } from '../../../../shared/model/dictionary/paging-result.model';
import { DetailActorManagerForest } from '../../../../shared/model/evaluate-actor/detail-actor-manager-forest.model';
import { NbDialogService } from '@nebular/theme';
import { ActorPopupComponent } from '../../../../shared/components/popups/actor-popup/actor-popup.component';
import { LookForInfoService } from '../../../../shared/service/look-for-info.service';
import { ActorReviewModel } from '../../../../shared/model/actor/actor-review.model';
import { PopupComponent } from '../../../../shared/components/popups/popup/popup.component';
import { AlertService } from '../../../../shared/service/alert.service';
import {Location} from '@angular/common';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'evaluate-actor-detail',
  templateUrl: './evaluate-actor-detail.component.html',
  styleUrls: ['./evaluate-actor-detail.component.scss'],
})
export class EvaluateActorDetailComponent implements OnInit {
  queryParamsSubscription: Subscription;
  forestPlotId: number;
  detailActorManagerForest: DetailActorManagerForest;
  averageRatingRounding = 4;
  pagedResultReview: PagedResult<ActorReviewModel> = new PagedResult<ActorReviewModel>();
  actorId: number;
  constructor(
    private activatedRoute: ActivatedRoute,
    private manageEvaluateService: ManageEvaluateService,
    private nbDialogService: NbDialogService,
    private lookForInfoService: LookForInfoService,
    private alertService: AlertService,
    private _location: Location,
  ) { }

  ngOnInit() {
    this.queryParamsSubscription = this.activatedRoute.params.subscribe(data => {
      this.forestPlotId = data.id;
    });
    // forkJoin(
    //   this.manageEvaluateService.detailAtorForForestPlotId(this.forestPlotId),
    //   this.lookForInfoService.getListReviewActorAdmin(this.forestPlotId, 0, 10)
    // ).subscribe(([res1, res2]) => {
    //   this.render(res1);
    //   this.renderReivew(res2);
    // });
    this.manageEvaluateService.detailAtorForForestPlotId(this.forestPlotId).switchMap(res1 => {
      this.actorId = res1.id;
      // tslint:disable-next-line:no-console
      console.log(this.actorId);
      this.render(res1);
      return this.lookForInfoService.getListReviewActorAdmin(this.actorId, this.forestPlotId, 0, 10);
    }).subscribe(res2 => {
      this.renderReivew(res2);
    });
  }

  renderReivew(pagedResultReview) {
    this.pagedResultReview = pagedResultReview;
  }

  render(detailActorManagerForest) {
    this.detailActorManagerForest = detailActorManagerForest;
    this.detailActorManagerForest.averageRating = +this.detailActorManagerForest.averageRating.toFixed(1);
    this.averageRatingRounding = +this.detailActorManagerForest.averageRating.toFixed(1);
    this.averageRatingRounding = this.roundHalf(this.averageRatingRounding);
    this.detailActorManagerForest.aggregateOfRatings = this.detailActorManagerForest.aggregateOfRatings.reverse();
    (this.detailActorManagerForest.aggregateOfRatings || []).forEach(item => {
      item.percent = +item.percent.toFixed(1);
    });
  }


  roundHalf(num) {
    return Math.round(num * 2) / 2;
  }

  viewDetail(forestPlotId) {
    this.nbDialogService
      .open(ActorPopupComponent, {
        context: {
          actor: null,
          actorType: null,
          forestPlotId: forestPlotId,
        },
      })
      .onClose.subscribe();
  }

  detailActor() {
    this.manageEvaluateService.detailAtorForForestPlotId(this.forestPlotId).subscribe(response => {
      this.render(response);
    });
  }

  detailReviewActor() {
    this.lookForInfoService.getListReviewActorAdmin(this.actorId, this.forestPlotId, 0, 10).subscribe(response => {
      this.renderReivew(response);
    });
  }

  actionEvaluate(action: string, contactReviewId: number) {
    this.nbDialogService
      .open(PopupComponent, {
        context: {
          showModel: {
            title: `${action} đánh giá`,
            notices: [
              `Bạn có chắc muốn ${action} đánh giá này?`,
            ],
            actions: [
              {
                actionname: 'đồng ý',
                actionvalue: true,
                actiontype: 'test',
              },
              {
                actionname: 'hủy',
                actionvalue: false,
                actiontype: 'test',
              },
            ],
          },
        },
      })
      .onClose.subscribe(actionAlow => {
        if (actionAlow) {
          switch (action) {
            case 'Ẩn': {
              this.manageEvaluateService.hideEvaluateActor(contactReviewId).subscribe(response => {
                this.detailActor();
                this.detailReviewActor();
                this.alertService.success('Ẩn đánh giá thành công.');
              },
                err => {
                  this.alertService.error('Đã xảy ra lỗi! Ẩn đánh giá không thành công.');
                });
              break;
            }
            case 'Hiện': {
              this.manageEvaluateService.showEvaluateActor(contactReviewId).subscribe(response => {
                this.detailActor();
                this.detailReviewActor();
                this.alertService.success('Hiện đánh giá thành công.');
              },
                err => {
                  this.alertService.error('Đã xảy ra lỗi! Hiện đánh giá không thành công.');
                });
              break;
            }
            case 'Xóa': {
              this.manageEvaluateService.deleteEvaluateActor(contactReviewId).subscribe(response => {
                this.detailActor();
                this.detailReviewActor();
                this.alertService.success('Xóa đánh giá thành công.');
              },
                err => {
                  this.alertService.error('Đã xảy ra lỗi! Xóa đánh giá không thành công.');
                });
              break;
            }
          }
        }
      });
  }

  pagedResultChange(pagedResult) {
    // tslint:disable-next-line:max-line-length
    this.lookForInfoService.getListReviewActorAdmin(this.actorId, this.forestPlotId, pagedResult.currentPage, pagedResult.pageSize).subscribe(response => {
      this.renderReivew(response);
    });
  }

  routerBack() {
    this._location.back();
  }

}
