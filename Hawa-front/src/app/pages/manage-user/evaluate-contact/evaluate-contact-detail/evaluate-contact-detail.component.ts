import { Component, OnInit, OnDestroy } from '@angular/core';
import { ManageEvaluateService } from '../../../../shared/service/manage-user-account/manage-evaluate.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { PagedResult } from '../../../../shared/model/dictionary/paging-result.model';
import { ReviewContactList } from '../../../../shared/model/contact/review-contact-list.model';
import { NbDialogService } from '@nebular/theme';
import { ContributingInformationFormComponent } from '../../../../shared/components/popups/contributing-information-form/contributing-information-form.component';
import { ContactList } from '../../../../shared/model/contact/contact-list.model';
import { ContactService } from '../../../../shared/service/contact.service';
import { ContactDetail } from '../../../../shared/model/contact/contact-detail.model';
import { LookForInfoService } from '../../../../shared/service/look-for-info.service';
import { AlertService } from '../../../../shared/service/alert.service';
import { PopupComponent } from '../../../../shared/components/popups/popup/popup.component';
import {Location} from '@angular/common';
@Component({
  selector: 'evaluate-contact-detail',
  templateUrl: './evaluate-contact-detail.component.html',
  styleUrls: ['./evaluate-contact-detail.component.scss']
})
export class EvaluateContactDetailComponent implements OnInit, OnDestroy {
  queryParamsSubscription: Subscription;
  contactId: number;
  pagedResult: PagedResult<ReviewContactList> = new PagedResult<ReviewContactList>();
  pagedResultComment: PagedResult<ReviewContactList> = new PagedResult<ReviewContactList>();
  contacDetailItem = new ContactDetail();
  averageRatingRounding: number;
  constructor(
    private manageEvaluateService: ManageEvaluateService,
    private activatedRoute: ActivatedRoute,
    private nbDialogService: NbDialogService,
    private contactService: ContactService,
    private lookForInfoService: LookForInfoService,
    private alertService: AlertService,
    private _location: Location
  ) { }

  ngOnInit() {
    this.queryParamsSubscription = this.activatedRoute.params.subscribe(data => {
      this.contactId = data.id;
    });
    this.manageEvaluateService.listEvaluateFromContact(this.contactId, 0, 10).subscribe(response => {
      this.render(response);

      this.contactService.detailContact(this.contactId).subscribe(response => {
        this.contacDetailItem = response;
        this.contacDetailItem.averageRating = +this.contacDetailItem.averageRating.toFixed(1);
        this.averageRatingRounding = this.roundHalf(response.averageRating);
        this.contacDetailItem.aggregateOfRatings = this.contacDetailItem.aggregateOfRatings.reverse();
        this.contacDetailItem.aggregateOfRatings.forEach(item => {
          item.percent = +item.percent.toFixed(1);
        });

        this.lookForInfoService.getListReviewContactAdmin(this.contactId, 0, 10).subscribe(response => {
          this.pagedResultComment = response;
        });
      });
    });
    
  }

  render(pagedResult) {
    this.pagedResult = pagedResult;
  }

  ngOnDestroy() {
    this.queryParamsSubscription.unsubscribe();
  }

  roundHalf(num) {
    return Math.round(num * 2) / 2;
  }

  viewDetail() {
    const item = new ContactList();
    item.id = this.contactId;
    this.nbDialogService
      .open(ContributingInformationFormComponent, {
        context: {
          action: 'view',
          itemContactList: item,
          forestPlotId: null,
          detailsofTreeSpecies: null,
          position: 'admin',
        }
      })
      .onClose.subscribe(reload => {
        // if (reload) {
        //   this.contactService.listContact(this.communeId, +this.pagedResult.currentPage, +this.pagedResult.pageSize).subscribe(response => {
        //     this.render(response);
        //   });
        // }
      });
  }

  pagedResultChange(pagedResult) {
    this.lookForInfoService.getListReviewContactAdmin(this.contactId, pagedResult.currentPage, pagedResult.pageSize).subscribe(response => {
      this.pagedResultComment = response;
    });
  }

  actionEvaluate(action: string, contactReviewId: number) {
    this.nbDialogService
      .open(PopupComponent, {
        context: {
          showModel: {
            title: `${action} đánh giá`,
            notices: [
              `Bạn có chắc muốn ${action} đánh giá này?`
            ],
            actions: [
              {
                actionname: 'đồng ý',
                actionvalue: true,
                actiontype: 'test'
              },
              {
                actionname: 'hủy',
                actionvalue: false,
                actiontype: 'test'
              }
            ]
          },
        },
      })
      .onClose.subscribe(actionAlow => {
        if (actionAlow) {
          switch (action) {
            case 'Ẩn': {
              this.manageEvaluateService.hideEvaluate(contactReviewId).subscribe(response => {
                this.refeshAfterActionEvaluate();
                this.detailContact();
                this.alertService.success('Ẩn đánh giá thành công.');
              },
                err => {
                  this.alertService.error('Đã xảy ra lỗi! Ẩn đánh giá không thành công.');
                })
              break;
            }
            case 'Hiện': {
              this.manageEvaluateService.showEvaluate(contactReviewId).subscribe(response => {
                this.refeshAfterActionEvaluate();
                this.detailContact();
                this.alertService.success('Hiện đánh giá thành công.');
              },
                err => {
                  this.alertService.error('Đã xảy ra lỗi! Hiện đánh giá không thành công.');
                })
              break;
            }
            case 'Xóa': {
              this.manageEvaluateService.deleteEvaluate(contactReviewId).subscribe(response => {
                this.refeshAfterActionEvaluate();
                this.detailContact();
                this.alertService.success('Xóa đánh giá thành công.');
              },
                err => {
                  this.alertService.error('Đã xảy ra lỗi! Xóa đánh giá không thành công.');
                })
              break;
            }
          }
        }
      });
  }

  refeshAfterActionEvaluate() {
    this.lookForInfoService.getListReviewContactAdmin(this.contactId, this.pagedResult.currentPage, this.pagedResult.pageSize).subscribe(response => {
      this.pagedResultComment = response;
    });
  }


  detailContact() {
    this.contactService.detailContact(this.contactId).subscribe(response => {
      this.contacDetailItem = response;
      this.contacDetailItem.averageRating = +this.contacDetailItem.averageRating.toFixed(1);
      this.averageRatingRounding = this.roundHalf(response.averageRating);
      this.contacDetailItem.aggregateOfRatings = this.contacDetailItem.aggregateOfRatings.reverse();
      this.contacDetailItem.aggregateOfRatings.forEach(item => {
        item.percent = +item.percent.toFixed(1);
      })
    });
  }

  routerBack() {
    this._location.back();
  }

}
