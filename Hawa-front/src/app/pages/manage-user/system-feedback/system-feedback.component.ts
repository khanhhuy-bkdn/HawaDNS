import { Component, OnInit } from '@angular/core';
import { PagedResult } from '../../../shared/model/dictionary/paging-result.model';
import { SystemFeedbackService } from '../../../shared/service/system-feedback/system-feedback.service';
import { NbDialogService } from '@nebular/theme';
import { PopupComponent } from '../../../shared/components/popups/popup/popup.component';
import { AlertService } from '../../../shared/service/alert.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'system-feedback',
  templateUrl: './system-feedback.component.html',
  styleUrls: ['./system-feedback.component.scss']
})
export class SystemFeedbackComponent implements OnInit {
  pagedResult: PagedResult<any> = new PagedResult<any>();
  listOfFeedbacks = new Array();
  filterText = '';
  toggle = true;
  listShowMore = [];
  get format() { return this.toggle ? 600 : 0 }
  constructor(
    private systemFeedbackService: SystemFeedbackService,
    private nbDialogService: NbDialogService,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
    this.systemFeedbackService.getListFeedback(this.filterText, 0, this.pagedResult.pageSize).subscribe(res => {
      this.rerender(res);
    })
  }
  rerender(result: any) {
    this.listOfFeedbacks = result.items;
    this.pagedResult = result;
  }
  pagedResultChange(pagedResult) {
    this.systemFeedbackService.getListFeedback(this.filterText, pagedResult.currentPage, pagedResult.pageSize).subscribe(result => this.rerender(result))
  }
  deleteFeedback(feedbackId) {
    this.nbDialogService
      .open(PopupComponent, {
        context: {
          showModel: {
            title: 'Xóa phản hồi',
            notices: [
              'Bạn có chắc muốn xóa phản hồi này?'
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
          this.systemFeedbackService.deteleFeedback(feedbackId).subscribe(res => {
            this.filter();
            this.alertService.success('Xóa phản hồi thành công.');
          }, err => {
            this.alertService.error('Đã có lỗi. Xóa phản hồi không thành công');
          })
        }
      });
  }
  filter() {
    this.systemFeedbackService.getListFeedback(this.filterText, 0, this.pagedResult.pageSize).subscribe(result => this.rerender(result))
  }
  clearFilter() {
    this.filterText = '';
    this.systemFeedbackService.getListFeedback('', 0, this.pagedResult.pageSize).subscribe(result => this.rerender(result))
  }
  toggleFormat(id) {
    if (this.listShowMore.includes(id)) {
      this.listShowMore.splice(this.listShowMore.indexOf(id), 1)
    } else {
      this.listShowMore.push(id);
    }
  }
  showMore(id) {
    if (this.listShowMore.includes(id)) {
      return true;
    } else {
      return false
    }
  }

}
