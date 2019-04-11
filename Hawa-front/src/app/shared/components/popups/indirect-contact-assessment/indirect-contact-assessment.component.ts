import { Component, OnInit, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CreateContactReview } from '../../../model/contact/create-contact-review.model';
import { LookForInfoService } from '../../../service/look-for-info.service';
import { ReviewContactList } from '../../../model/contact/review-contact-list.model';
import { ContactPercent } from '../../../model/contact/contact-percent.model';
import { ContactService } from '../../../service/contact.service';
import { PagedResultContactList } from '../../../model/contact/page-result-contact-list.model';

@Component({
  selector: 'indirect-contact-assessment',
  templateUrl: './indirect-contact-assessment.component.html',
  styleUrls: ['./indirect-contact-assessment.component.scss']
})
export class IndirectContactAssessmentComponent implements OnInit {
  @Input() contactId: number;
  indirectContact: FormGroup;
  createContactReview = new CreateContactReview();
  errorRating = false;
  pagedResult: PagedResultContactList<ReviewContactList> = new PagedResultContactList<ReviewContactList>();
  @Input() averageRating: number;
  @Input() aggregateOfRatings: ContactPercent[];
  averageRatingRounding: number;
  refeshDefault: number;
  minor = 1;
  change: number;
  errorEvaluate = false;
  isLoadingRate: boolean = false;
  apiErrorCode;
  changeValuePopupError = 0;
  constructor(
    private dialogRef: NbDialogRef<IndirectContactAssessmentComponent>,
    private fb: FormBuilder,
    private lookForInfoService: LookForInfoService,
    private contactService: ContactService
  ) { }

  ngOnInit() {
    this.createContactReview.rating = 0;
    this.averageRating = +this.averageRating.toFixed(1);
    this.aggregateOfRatings.forEach(item => {
      item.percent = +item.percent.toFixed(1);
    });
    this.aggregateOfRatings = this.aggregateOfRatings.reverse();
    this.averageRatingRounding = this.roundHalf(this.averageRating);

    //=========
    // this.contactService.detailContact(this.contactId).subscribe(response => {
    // this.averageRating = +response.averageRating.toFixed(2);
    // this.change = this.roundHalf(+response.averageRating);
    // this.aggregateOfRatings = response.aggregateOfRatings;
    // this.aggregateOfRatings.forEach(item => {
    //   item.percent = +item.percent.toFixed(1);
    // });
    // this.aggregateOfRatings = this.aggregateOfRatings.reverse();
    // });

    this.lookForInfoService.getListReviewContact(this.contactId, 0, 10).subscribe(response => {
      this.render(response);
    })
    this.createContactReview.contactId = this.contactId;
  }

  roundHalf(num) {
    return Math.round(num * 2) / 2;
  }

  render(pagedResult) {
    this.pagedResult = pagedResult;
  }

  closePopup() {
    this.dialogRef.close();
  }

  submitComment() {
    if (this.createContactReview.rating) {
      this.isLoadingRate = true;
      this.lookForInfoService.createReviewContact(this.createContactReview).subscribe(response => {
        this.pagedResult.items.unshift(response);
        this.pagedResult.total = +this.pagedResult.total + 1;
        if (this.pagedResult.extraData && this.pagedResult.extraData.reviewCount) {
          this.pagedResult.extraData.reviewCount = this.pagedResult.extraData.reviewCount + 1;
        }
        this.pagedResult.extraData.isUserReview = true;
        this.render(this.pagedResult);
        this.createContactReview.rating = 0;
        this.createContactReview.title = '';
        this.createContactReview.content = '';
        this.refeshDefault = 0;
        this.minor++;
        this.contactService.detailContact(this.contactId).subscribe(response => {
          this.averageRating = +response.averageRating.toFixed(1);
          this.change = this.roundHalf(+response.averageRating);
          this.aggregateOfRatings = response.aggregateOfRatings;
          this.aggregateOfRatings.forEach(item => {
            item.percent = +item.percent.toFixed(1);
          });
          this.aggregateOfRatings = this.aggregateOfRatings.reverse();
        });
        this.isLoadingRate = false;
      },
        err => {
          this.isLoadingRate = false;
          if (JSON.parse(err._body).errorCode === 'BusinessException') {
            this.changeValuePopupError = this.changeValuePopupError + 1;
            this.apiErrorCode = JSON.parse(err._body).errorMessage;
          } else {
            this.changeValuePopupError = this.changeValuePopupError + 1;
            this.apiErrorCode = 'Đã có lỗi xin vui lòng thử lại';
          }
        })
    } else {
      if (!this.errorEvaluate) {
        this.errorRating = true;
      }
    }
  }

  pagedResultChange(pagedResult) {
    this.lookForInfoService.getListReviewContact(this.contactId, pagedResult.currentPage, pagedResult.pageSize).subscribe(response => {
      this.render(response);
    })
  }

  getRateValue(ratevalue) {
    this.createContactReview.rating = ratevalue;
  }

}
