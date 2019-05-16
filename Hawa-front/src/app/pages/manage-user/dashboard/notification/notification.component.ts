import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../../../shared/service/notification/notification.service';
import { NotificationItem } from '../../../../shared/model/noitification/notification-item.model';
import { PagedResult } from '../../../../shared/model/dictionary/paging-result.model';
import * as moment from 'moment';
import { NotificationFilter } from '../../../../shared/model/noitification/notification-filter.model';
import { Router } from '@angular/router';
import { ContributingInformationFormComponent } from '../../../../shared/components/popups/contributing-information-form/contributing-information-form.component';
import { NbDialogService } from '@nebular/theme';
import { ContactList } from '../../../../shared/model/contact/contact-list.model';
import { Dictionary } from '../../../../shared/model/dictionary/dictionary.model';
import { ActorService } from '../../../../shared/service/actor/actor.service';
import { AlertService } from '../../../../shared/service/alert.service';
@Component({
  selector: 'notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  loading: boolean;
  pagedResult: PagedResult<NotificationItem> = new PagedResult<NotificationItem>();
  filterModel = new NotificationFilter();
  dateNotification: any;
  alwaysShowCalendars: boolean;
  ranges: any = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
  }
  invalidDates: moment.Moment[] = [];

  // moment().add(2, 'days'), moment().add(3, 'days'), moment().add(5, 'days')

  isInvalidDate = (m: moment.Moment) => {
    return this.invalidDates.some(d => d.isSame(m, 'day'))
  }
  url: string;
  isPageAllNoti: boolean;
  constructor(
    private nbDialogService: NbDialogService,
    private notificationService: NotificationService,
    private router: Router,
    private actorService: ActorService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.alwaysShowCalendars = true;
    this.filterModel.systemType = 'Message';
    this.filterModel.isRead = null;
    this.url = this.router.url;
    if (this.url === '/pages/dashboard/notification') {
      this.isPageAllNoti = true;
    }
    this.loading = true;
    this.notificationService.getNotificationList(0, 10, this.filterModel).subscribe(response => {
      this.pagedResult = response;
      this.loading = false;
    })
  }

  refesh() {
    this.notificationService.getNotificationList(this.pagedResult.currentPage, this.pagedResult.pageSize, this.filterModel).subscribe(response => {
      this.render(response);
    })
  }

  pagedResultChange(pagedResult) {
    this.notificationService.getNotificationList(pagedResult.currentPage, pagedResult.pageSize, this.filterModel).subscribe(response => {
      this.render(response);
    })
  }

  render(pagedResult: any) {
    this.pagedResult = pagedResult;
  }

  readNotification(notificationItem: NotificationItem) {
    switch (notificationItem.notificationType) {
      case 'AddedContact':
      case 'ChangeContactStatus':
      case 'ApprovedContact':
      case 'RejectedContact': {
        this.viewNotification(notificationItem);
        const itemContactList = new ContactList();
        itemContactList.id = notificationItem.notificationObjectID;
        this.nbDialogService
          .open(ContributingInformationFormComponent, {
            context: {
              action: 'view',
              itemContactList: itemContactList,
              // forestPlotId: this.forestPlotId,
              // detailsofTreeSpecies: this.detailsofTreeSpecies,
              position: 'admin',
              approved: true
            }
          })
          .onClose.subscribe(reload => {
          });
        break;
      }
      case 'AddedActorEvaluation': {
        this.actorService.viewReviewActor(notificationItem.notificationObjectID).subscribe(reponse => {
          this.viewNotification(notificationItem);
          this.router.navigate([`/pages/evaluate-actor/detail/${reponse.forestPlotId}`]);
        }, err => {
          this.alertService.error('Thông tin đã không tồn tại');
        })
        break;
      }
      case 'AddedContactEvaluation': {
        this.viewNotification(notificationItem);
        this.router.navigate([`/pages/evaluate-contact/detail/${notificationItem.notificationObjectID}`]);
        break;
      }
    }
  }

  viewNotification(notificationItem: NotificationItem) {
    console.log('notificationItem', notificationItem);
    if (notificationItem.arNotificationRead === false) {
      this.notificationService.readNotification(notificationItem.id).subscribe(response => {
        notificationItem.arNotificationRead = true;
      });
    }
  }

  changeStartDateAndEndDate() {
    if (this.dateNotification) {
      this.filterModel.startDate = this.dateNotification.startDate && this.dateNotification.startDate._d;
      this.filterModel.endDate = this.dateNotification.endDate && this.dateNotification.endDate._d;
      this.refesh();
    }
  }

  changeStatus() {
    this.refesh();
  }

}
