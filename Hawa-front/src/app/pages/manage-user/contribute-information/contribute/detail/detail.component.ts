import { Component, OnInit } from '@angular/core';
import { PagedResult } from '../../../../../shared/model/dictionary/paging-result.model';
import { BehaviorSubject, Subscription } from 'rxjs';
import { NbDialogService } from '@nebular/theme';
import { PopupContributeComponent } from '../../component/popup-contribute/popup-contribute.component';
import { DetailContribute } from '../../../../../shared/model/contribute-information/detail-contribute.model';
import { ItemUnit } from '../../../../../shared/model/dictionary/item-unit.model';
import { DataGeneralService } from '../../../../../shared/service/data-general.service';
import { ManageBuyerService } from '../../../../../shared/service/manage-user-account/manage-buyer.service';
import { ManagerForestPlotService } from '../../../../../shared/service/manage-user-account/manager-forest-plot.service';
import { ForestPlotItem } from '../../../../../shared/model/contribute-information/forest-plot-item.model';
import { Router, ActivatedRoute } from '@angular/router';
import { ContributeStatus } from '../../../../../shared/model/contribute-information/contribute-status.model';
import { ContributingInformationFormComponent } from '../../../../../shared/components/popups/contributing-information-form/contributing-information-form.component';
import { ContactList } from '../../../../../shared/model/contact/contact-list.model';
import { ContactService } from '../../../../../shared/service/contact.service';
import { ContributingInformationDetailComponent } from '../../../../../shared/components/popups/contributing-information-detail/contributing-information-detail.component';
import { PopupComponent } from '../../../../../shared/components/popups/popup/popup.component';
import { AlertService } from '../../../../../shared/service/alert.service';
import { IndirectContactAssessmentComponent } from '../../../../../shared/components/popups/indirect-contact-assessment/indirect-contact-assessment.component';
import { PagedExtraResult } from '../../../../../shared/model/contribute-information/paged-extra-result.model';
import { ExtraDataContribute } from '../../../../../shared/model/contribute-information/extradata-detail.model';
import { OverviewForest } from '../../../../../shared/model/overview-forest.model';

@Component({
  selector: 'detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  searchTerm$ = new BehaviorSubject<string>('');
  contactStatuseFilter = new ContributeStatus();
  communeId: number | string;
  contactStatuses = new Array<ItemUnit>();
  pagedResult: PagedExtraResult<ForestPlotItem, ExtraDataContribute> = new PagedExtraResult<ForestPlotItem, ExtraDataContribute>();
  // pagedResult: PagedResult<ForestPlotItem> = new PagedResult<ForestPlotItem>();
  // forestPlotList = new Array<ForestPlotItem>();
  subscription: Subscription;
  approved: boolean;
  contributorID: number;
  constructor(
    private nbDialogService: NbDialogService,
    private dataGeneralService: DataGeneralService,
    private managerForestPlotService: ManagerForestPlotService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private contactService: ContactService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.contributorID = JSON.parse(window.localStorage.getItem('HAWA_USER')) && JSON.parse(window.localStorage.getItem('HAWA_USER')).id ? JSON.parse(window.localStorage.getItem('HAWA_USER')).id : '';
    this.activatedRoute.params.subscribe(params => {
      this.communeId = params['communeId'];
    });
    this.getMasterData();
    this.managerForestPlotService
      .instantSearchPlots(this.communeId, this.searchTerm$, this.contactStatuseFilter, 0, 10)
      .subscribe(response => {
        this.rerender(response);
      });
  }
  getMasterData() {
    this.dataGeneralService.getMasterData.subscribe(masterData => {
      this.contactStatuses = masterData.contactStatuses.map(item => ({
        key: item.key,
        code: item.code,
        text: item.text,
      }));
    });
  }
  clearFilter() {
    this.contactStatuseFilter.contactStatus = '';
    this.filter();
  }
  filter() {
    this.managerForestPlotService
      .searchPlotList(this.communeId, this.searchTerm$.value, this.contactStatuseFilter, 0, this.pagedResult.pageSize)
      .subscribe(result => this.rerender(result));
  }
  rerender(pagedResult) {
    this.pagedResult = pagedResult;
    (this.pagedResult.items || []).forEach(item => {
      item.averageRating = +item.averageRating.toFixed(1);
    })
  }
  pagedResultChange(pagedResult) {
    this.managerForestPlotService
      .searchPlotList(this.communeId, this.searchTerm$.value, this.contactStatuseFilter, pagedResult.currentPage, this.pagedResult.pageSize)
      .subscribe(result => {
        this.rerender(result);
      });
  }

  viewDetail(infoContribute: DetailContribute) {
    this.nbDialogService.open(PopupContributeComponent, {
      context: {
        action: 'info',
        detailContribute: {
          title: infoContribute.title,
          date: infoContribute.date,
          target: infoContribute.target,
          host: infoContribute.host,
          acronymname: infoContribute.acronymname,
          contact: infoContribute.contact,
          phone: infoContribute.phone,
          email: infoContribute.email,
          website: infoContribute.website,
          province: infoContribute.province && {
            key: infoContribute.province.key,
            code: infoContribute.province.code,
            text: infoContribute.province.text
          },
          district: infoContribute.district && {
            key: infoContribute.district.key,
            code: infoContribute.district.code,
            text: infoContribute.district.text
          },
          ward: infoContribute.ward && {
            key: infoContribute.ward.key,
            code: infoContribute.ward.code,
            text: infoContribute.ward.text
          },
          houseNo: infoContribute.houseNo,
          address: infoContribute.address,
          note: infoContribute.note,
          images: infoContribute.images.map(image => image),
          status: infoContribute.status
        }
      }
    })
  }

  routerBack() {
    this.router.navigate(['/pages/contribute-information/contribute/list']);
  }

  contributeInformation(action: string, item: ContactList) {
    const overviewForest = new OverviewForest();
    overviewForest.stateProvince = (this.pagedResult && this.pagedResult.extraData && this.pagedResult.extraData.stateProvince) ? this.pagedResult.extraData.stateProvince : null;
    overviewForest.district = (this.pagedResult && this.pagedResult.extraData && this.pagedResult.extraData.district) ? this.pagedResult.extraData.district : null;
    overviewForest.commune = (this.pagedResult && this.pagedResult.extraData && this.pagedResult.extraData.commune) ? this.pagedResult.extraData.commune : null;
    // if (action === 'create' || action === 'edit') {
    this.nbDialogService
      .open(ContributingInformationFormComponent, {
        context: {
          action: action,
          itemContactList: item,
          forestPlotId: this.communeId,
          detailsofTreeSpecies: overviewForest,
          position: 'admin',
          approved: true,
        }
      })
      .onClose.subscribe(reload => {
        if (reload) {
          this.managerForestPlotService
            .searchPlotList(this.communeId, this.searchTerm$.value, this.contactStatuseFilter, this.pagedResult.currentPage, this.pagedResult.pageSize)
            .subscribe(result => this.rerender(result));
        }
      });
    // } else {
    //   this.nbDialogService
    //     .open(ContributingInformationDetailComponent, {
    //       context: {
    //         action: action,
    //         itemContactList: item,
    //         position: 'admin',
    //         detailsofTreeSpecies: overviewForest,
    //         approved: true,
    //       }
    //     })
    //     .onClose.subscribe(reload => {
    //       if (reload) {
    //         this.managerForestPlotService
    //           .searchPlotList(this.communeId, this.searchTerm$.value, this.contactStatuseFilter, 0, this.pagedResult.pageSize)
    //           .subscribe(result => this.rerender(result));
    //       }
    //     });
    // }
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
            // this.pagedResult.items.forEach((item, index) => {
            //   if (item.id === contactId) {
            //     this.pagedResult.items.splice(index, 1);
            //   }
            // });
            this.filter();
            this.alertService.success('Xóa đóng góp thành công.');
          }, err => {
            this.alertService.error('Đã xảy ra lỗi. Xóa đóng góp không thành công.');
          })
        }
      });
  }

  evaluateContact(item: ContactList) {
    if (item && item.contributor && this.contributorID !== item.contributor.id && item.status && item.status.key !== 'HuyBo') {
      this.nbDialogService
        .open(IndirectContactAssessmentComponent, {
          context: {
            contactId: item.id,
            averageRating: item.averageRating,
            aggregateOfRatings: item.aggregateOfRatings,
          }
        })
        .onClose.subscribe(val => {
          this.managerForestPlotService
            .searchPlotList(this.communeId, this.searchTerm$.value, this.contactStatuseFilter, this.pagedResult.currentPage, this.pagedResult.pageSize)
            .subscribe(result => this.rerender(result));
        }
        );
    }
  }
}
