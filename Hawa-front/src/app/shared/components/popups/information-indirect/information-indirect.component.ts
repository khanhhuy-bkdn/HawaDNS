import { Component, OnInit, Input } from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { IndirectContactAssessmentComponent } from '../indirect-contact-assessment/indirect-contact-assessment.component';
import { forkJoin } from 'rxjs';
import { ContactService } from '../../../service/contact.service';
import { PagedResult } from '../../../model/dictionary/paging-result.model';
import { ContactList } from '../../../model/contact/contact-list.model';
import { ContactDictionary } from '../../../model/contact/contact-dictionary.model';
import { OverviewForest } from '../../../model/overview-forest.model';
import { ContributingInformationDetailComponent } from '../contributing-information-detail/contributing-information-detail.component';
import { ContributingInformationFormComponent } from '../contributing-information-form/contributing-information-form.component';
import { AlertService } from '../../../service/alert.service';
import { ConfirmationService } from '../../../service/confirmation.service';
import { ContactListAll } from '../../../model/contact/contact-list-all.model';
import { SessionService } from '../../../service/session.service';
import { PopupComponent } from '../popup/popup.component';
import { ItemUnit } from '../../../model/dictionary/item-unit.model';
@Component({
  selector: 'information-indirect',
  templateUrl: './information-indirect.component.html',
  styleUrls: ['./information-indirect.component.scss']
})
export class InformationIndirectComponent implements OnInit {
  @Input() forestPlotId: number;
  @Input() communeId: string;
  pagedResult: PagedResult<ContactList> = new PagedResult<ContactList>();
  ubnd: ItemUnit;
  forestProtectionDepartment: ItemUnit;
  @Input() detailsofTreeSpecies: OverviewForest;
  contributorID: number;
  admin = false;
  position: string;
  constructor(
    private dialogRef: NbDialogRef<InformationIndirectComponent>,
    private nbDialogService: NbDialogService,
    private contactService: ContactService,
    private alertService: AlertService,
    private confirmationService: ConfirmationService,
    private sessionService: SessionService,
  ) { }

  ngOnInit() {
    this.contributorID = JSON.parse(window.localStorage.getItem('HAWA_USER')) && JSON.parse(window.localStorage.getItem('HAWA_USER')).id ? JSON.parse(window.localStorage.getItem('HAWA_USER')).id : '';
    if (this.sessionService.currentSession.role && this.sessionService.currentSession.role === 'Admin') {
      this.admin = true;
      this.position = 'admin';
    }
    this.contactService.listContact(this.communeId, 0, 5)
      .subscribe(response => {
        this.render(response);
      });
  }

  render(pagedResult) {
    this.pagedResult = pagedResult.contacts;
    (this.pagedResult.items || []).forEach(item => {
      item.averageRating = +item.averageRating.toFixed(1);
    })
    this.ubnd = pagedResult.ubnd ? pagedResult.ubnd : null;
    this.forestProtectionDepartment = pagedResult.forestProtectionDepartment;
  }

  closePopup() {
    this.dialogRef.close();
  }

  contributeInformation(action: string, item: ContactList) {
    if (this.position !== 'admin') {
      if (item && item.contributor && this.contributorID === item.contributor.id) {
        this.position = 'contributor';
      } else {
        this.position = null;
      }
    }
    this.nbDialogService
      .open(ContributingInformationFormComponent, {
        context: {
          action: action,
          itemContactList: item,
          forestPlotId: this.forestPlotId,
          detailsofTreeSpecies: this.detailsofTreeSpecies,
          position: this.position,
        }
      })
      .onClose.subscribe(reload => {
        if (reload) {
          this.contactService.listContact(this.communeId, +this.pagedResult.currentPage, +this.pagedResult.pageSize).subscribe(response => {
            this.render(response);
          });
        }
      });
    // } else {
    //   this.nbDialogService
    //     .open(ContributingInformationDetailComponent, {
    //       context: {
    //         action: action,
    //         itemContactList: item,
    //         detailsofTreeSpecies: this.detailsofTreeSpecies
    //       }
    //     })
    //     .onClose.subscribe();
    // }
  }

  evaluateContact(item: ContactList) {
    if ((item && !item.contributor) || item && item.contributor && this.contributorID !== item.contributor.id) {
      this.nbDialogService
        .open(IndirectContactAssessmentComponent, {
          context: {
            contactId: item.id,
            averageRating: item.averageRating,
            aggregateOfRatings: item.aggregateOfRatings,
          }
        })
        .onClose.subscribe(val => {
          this.contactService.listContact(this.communeId, +this.pagedResult.currentPage, +this.pagedResult.pageSize)
            .subscribe(response => {
              this.render(response);
            });
        }
        );
    }
  }

  deleteContribute(contactId: number) {
    this.nbDialogService
      .open(PopupComponent, {
        context: {
          showModel: {
            title: 'Xóa thông tin đóng góp',
            notices: [
              'Bạn có chắc muốn xóa thông tin đóng góp này?'
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
      .onClose.subscribe(isDeleteUser => {
        if (isDeleteUser) {
          this.contactService.deleteContact(contactId).subscribe(response => {
            this.pagedResult.items.forEach((item, index) => {
              if (item.id === contactId) {
                this.pagedResult.items.splice(index, 1);
              }
            });
            this.alertService.success('Xóa đóng góp thành công.');
          }, err => {
            this.alertService.error('Đã xảy ra lỗi. Xóa đóng góp không thành công.');
          })
        }
      });
  }

  pagedResultChange(pagedResult) {
    this.contactService.listContact(this.communeId, pagedResult.currentPage, pagedResult.pageSize)
      .subscribe(response => {
        this.render(response);
      });
  }
}
