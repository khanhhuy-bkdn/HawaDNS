import { Component, OnInit, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { ActorModel } from '../../../model/actor/actor.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CreateActorReview } from '../../../model/actor/create-actor-review.model';
import { LookForInfoService } from '../../../service/look-for-info.service';
// import { PagedResult } from '../../../modcreateActorReview/dictionary/paging-result.model';
import { ActorReviewModel } from '../../../model/actor/actor-review.model';
import { AlertService } from '../../../service/alert.service';
import { AdministrativeUnit } from '../../../model/dictionary/administrative-unit';
import { PagedResult } from '../../../model/dictionary/paging-result.model';
import { ActorForesplot } from '../../../model/actor/actor-foresplot.model';
import { PagedResultActorForestList } from '../../../model/actor/page-result-actor-forest-list.model';

@Component({
  selector: 'actor-popup',
  templateUrl: './actor-popup.component.html',
  styleUrls: ['./actor-popup.component.scss']
})
export class ActorPopupComponent implements OnInit {
  @Input() actor: ActorModel;
  @Input() actorType: string;
  @Input() forestPlotId: number;
  actorDetail: ActorForesplot;
  actorForm: FormGroup;
  pagedResult: PagedResultActorForestList<ActorReviewModel> = new PagedResultActorForestList<ActorReviewModel>();
  listOfReviewsActor = new Array<ActorReviewModel>();
  isShowComment = false;
  createActorReview = new CreateActorReview();
  isNotRated = false;
  averageRating: number | string;
  averageRatingRound: number;
  aggregateOfRatings = [];
  change: number;
  errorEvaluate = false;
  apiErrorCode;
  changeValuePopupError = 0;
  constructor(
    private dialogRef: NbDialogRef<ActorModel>,
    private fb: FormBuilder,
    private lookForInfoService: LookForInfoService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.getInfoActor();
    this.createActorReview.actorId = this.actor.id;
    this.createActorReview.forestPlotId = this.forestPlotId;
    // setTimeout(() => {
    //   this.getListReviewsActor();
    // }, 500);

  }
  getInfoActor() {
    this.lookForInfoService.viewActorForForestplot(this.actor.id, this.forestPlotId).subscribe(actorDetail => {
      this.actorDetail = actorDetail;
      this.averageRating = actorDetail.averageRating ? actorDetail.averageRating.toFixed(1) : 0;
      this.averageRatingRound = Number(this.roundHalf(this.averageRating));
      this.change = Number(this.roundHalf(this.averageRating));
      this.aggregateOfRatings = actorDetail.aggregateOfRatings ? actorDetail.aggregateOfRatings.reverse() : [];
      this.getListReviewsActor();
    });
  }

  closePopup() {
    this.dialogRef.close();
  }

  writeComment() {
    this.isShowComment = true;
  }

  closeComment() {
    this.isShowComment = false;
  }
  submitComment() {
    if (!this.createActorReview.rating || this.createActorReview.rating === 0) {
      return this.isNotRated = true;
    } else {
      this.lookForInfoService.reviewActor(this.createActorReview).subscribe(res => {
        this.isShowComment = false;
        this.createActorReview.content = '';
        this.createActorReview.rating = 0;
        this.createActorReview.title = ''
        this.listOfReviewsActor.unshift(res);
        this.pagedResult.total = +this.pagedResult.total + 1;
        this.pagedResult.extraData.isUserReview = true;
        this.errorEvaluate = false;
        this.getInfoActor();
      }, err => {
        if (JSON.parse(err._body).errorCode === 'BusinessException') {
          this.changeValuePopupError = this.changeValuePopupError + 1;
          this.apiErrorCode = JSON.parse(err._body).errorMessage;
        } else {
          this.changeValuePopupError = this.changeValuePopupError + 1;
          this.alertService.error('Đã có lỗi xin vui lòng thử lại!');
        }
      });
    }
  }
  getRateValue(ratevalue) {
    this.createActorReview.rating = ratevalue;
    this.isNotRated = false;
  }

  getListReviewsActor() {
    this.lookForInfoService
      .getListReviewActor(this.actor.id, this.forestPlotId, 0, this.pagedResult.pageSize)
      .subscribe(result => {
        this.rerender(result);
      });
  }

  pagedResultChange(pagedResult) {
    this.lookForInfoService
      .getListReviewActor(this.actor.id, this.forestPlotId, pagedResult.currentPage, pagedResult.pageSize)
      .subscribe(result => {
        this.rerender(result);
      });
  }
  rerender(pagedResult: PagedResultActorForestList<ActorReviewModel>) {
    this.listOfReviewsActor = pagedResult.items;
    this.pagedResult = pagedResult;
  }
  roundHalf(num) {
    return Math.round(num * 2) / 2;
  }
}
