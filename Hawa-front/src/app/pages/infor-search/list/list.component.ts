import { Component, OnInit, HostListener } from '@angular/core';
import { AdministrativeUnit } from '../../../shared/model/dictionary/administrative-unit';
import { PagedResult } from '../../../shared/model/dictionary/paging-result.model';
import { DataGeneralService } from '../../../shared/service/data-general.service';
import { forkJoin, Observable } from 'rxjs';
import { NbDialogService } from '@nebular/theme';
import { InforFeedbackComponent } from '../infor-feedback/infor-feedback.component';
import { LookForInfoService } from '../../../shared/service/look-for-info.service';
import { FilterOVerviewForest } from '../../../shared/model/filter-overview-forest.model';
import { OverviewForest } from '../../../shared/model/overview-forest.model';
import { AlertService } from '../../../shared/service/alert.service';
import { GroupTree } from '../../../shared/model/forest-plot/group-tree.model';
// import { TreespecsList } from '../../../shared/model/treespecs-list.model';
import { TreeSpecGroup } from '../../../shared/model/setting/tree-spec-group/tree-spec-group.model';
import { TreeSpecGroupService } from '../../../shared/service/setting/tree-spec-group.service';
import { GoogleMapComponent } from '../../../shared/components/popups/google-map/google-map.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  dialogFeedback;
  dialogViewDetail;
  stateProvinces: AdministrativeUnit[];
  districts: AdministrativeUnit[];
  communes: AdministrativeUnit[];
  // treespecsList: TreespecsList[];
  treeSpecGroupList = new Array<TreeSpecGroup>();
  pagedResult: PagedResult<OverviewForest> = new PagedResult<OverviewForest>();
  filterOVerviewForest = new FilterOVerviewForest();
  currentSort = '';
  orderBy = '';
  loading = false;
  isLike: boolean;
  contentFeedBack = '';
  provinceTemp: string;
  districtTemp = null;
  communeTemp = null;
  isErrorsFilter: boolean;
  captchaResponse: string;
  recaptChaKey: string;
  constructor(
    private dataGeneralService: DataGeneralService,
    private nbDialogService: NbDialogService,
    private lookForInfoService: LookForInfoService,
    private alertService: AlertService,
    private treeSpecGroupService: TreeSpecGroupService
  ) { }

  ngOnInit() {
    // this.filterOVerviewForest.stateProvinceID = {
    //   code: '70',
    //   key: '45',
    //   text: 'Tỉnh Bình Phước',
    // };
    // this.provinceTemp = '45';
    this.recaptChaKey = environment.recaptChaKey;
    this.filterOVerviewForest.districtID = null;
    this.filterOVerviewForest.communeID = null;
    this.filterOVerviewForest.treeSpecID = null;
    this.filterOVerviewForest.treeSpecGroupID = null;
    this.loading = true;
    this.isLike = true;
    this.isErrorsFilter = false;
    forkJoin(
      this.dataGeneralService.getProvincesNotHidden(),
      // this.dataGeneralService.getTreespecsAll(),
      this.treeSpecGroupService.getListTreeSpecGroupNoQuery(),
    )
      .subscribe(([res1, res3]) => {
        this.stateProvinces = res1;
        this.treeSpecGroupList = res3;
        if (this.lookForInfoService.filterList) {
          this.filterOVerviewForest = this.lookForInfoService.filterList;
          if (this.filterOVerviewForest.stateProvinceID) {
            this.provinceTemp = this.filterOVerviewForest.stateProvinceID.key;
            this.dataGeneralService.getDistricts(this.filterOVerviewForest.stateProvinceID.code).subscribe(data => {
              this.districts = data;
            });
          }
          if (this.filterOVerviewForest.districtID) {
            this.districtTemp = this.filterOVerviewForest.districtID.key;
            this.dataGeneralService.getWards(this.filterOVerviewForest.districtID.code).subscribe(data => {
              this.communes = data;
            });
          }
          if (this.filterOVerviewForest.communeID) {
            this.communeTemp = this.filterOVerviewForest.communeID.key;
          }
          this.lookForInfoService.getForestplotlist(this.filterOVerviewForest, this.lookForInfoService.currentPage ? this.lookForInfoService.currentPage : 0, this.lookForInfoService.pageSize ? this.lookForInfoService.pageSize : 10).subscribe(data => {
            this.render(data);
          });
        } else {
          this.filterOVerviewForest.stateProvinceID = {
            code: '70',
            key: '45',
            text: 'Tỉnh Bình Phước',
          };
          this.provinceTemp = '45';
          this.getDistricts(this.filterOVerviewForest.stateProvinceID.key);
          this.lookForInfoService.getForestplotlist(this.filterOVerviewForest, this.lookForInfoService.currentPage ? this.lookForInfoService.currentPage : 0, this.lookForInfoService.pageSize ? this.lookForInfoService.pageSize : 10).subscribe(data => {
            this.render(data);
          });
        }
      });
    // this.lookForInfoService.getForestplotlist(this.filterOVerviewForest, 0, 10).subscribe(data => {
    //   this.render(data);
    // });
  }

  render(pagedResult) {
    this.pagedResult = pagedResult;
    this.loading = false;
  }

  pagedResultChange(pagedResult) {
    this.loading = true;
    this.lookForInfoService.getForestplotlist(this.filterOVerviewForest, pagedResult.currentPage, pagedResult.pageSize)
      .subscribe(result => {
        this.render(result);
      });
  }

  feedbackInfor() {
    if (this.contentFeedBack.trim() !== '') {
      this.lookForInfoService.feedBack(this.isLike, this.contentFeedBack).subscribe(response => {
        this.nbDialogService.open(InforFeedbackComponent, {
        });
        this.isLike = true;
        this.contentFeedBack = '';
        grecaptcha.reset();
        this.captchaResponse = null;
      }, err => {
        this.alertService.error('Đã xảy ra lỗi, gửi đánh giá không thành công');
      })
    } else {
      this.alertService.error('Vui lòng nhập đánh giá của bạn');
    }
  }

  closePopuupFeedback() {
    this.dialogFeedback.close();
  }

  closePopuupViewDeital() {
    this.dialogViewDetail.close();
  }

  getDistricts(provinceCode) {
    if (provinceCode === 'null') {
      this.filterOVerviewForest.stateProvinceID = null;
      this.districtTemp = null;
    } else {
      this.filterOVerviewForest.stateProvinceID = this.stateProvinces.filter(item => item.key == provinceCode)[0];
    }
    if (this.filterOVerviewForest.stateProvinceID) {
      this.dataGeneralService.getDistricts(this.filterOVerviewForest.stateProvinceID.code).subscribe(data => {
        this.districts = data;
      });
    }
    this.filterOVerviewForest.districtID = null;
    this.communes = new Array<AdministrativeUnit>();
    this.filterOVerviewForest.communeID = null;
  }

  getWards(provinceCode) {
    if (provinceCode === 'null') {
      this.filterOVerviewForest.districtID = null;
      this.communeTemp = null;
    } else {
      this.filterOVerviewForest.districtID = this.districts.filter(item => item.key == provinceCode)[0];
    }
    if (this.filterOVerviewForest.districtID) {
      this.dataGeneralService.getWards(this.filterOVerviewForest.districtID.code).subscribe(data => {
        this.communes = data;
      });
    }
    this.filterOVerviewForest.communeID = null;
  }

  changeCommune(provinceCode) {
    if (provinceCode === 'null') {
      this.filterOVerviewForest.communeID = null;
    } else {
      this.filterOVerviewForest.communeID = this.communes.filter(item => item.key == provinceCode)[0];
    }
  }

  filter() {
    if (this.filterOVerviewForest.stateProvinceID === null && this.filterOVerviewForest.treeSpecGroupID === null) {
      this.isErrorsFilter = true;
      this.pagedResult = {
        currentPage: null,
        pageSize: null,
        pageCount: null,
        total: null,
        items: null
      }
    } else {
      this.isErrorsFilter = false;
      this.refesh(false);
    }
  }

  clearFilter() {
    this.provinceTemp = '45';
    this.filterOVerviewForest.stateProvinceID = {
      code: '70',
      key: '45',
      text: 'Tỉnh Bình Phước',
    };
    this.provinceTemp = '45';
    this.districtTemp = null;
    this.communeTemp = null;
    this.getDistricts(this.filterOVerviewForest.stateProvinceID.key);
    this.filterOVerviewForest.districtID = null;
    this.filterOVerviewForest.communeID = null;
    this.filterOVerviewForest.treeSpecGroupID = null;
    this.filterOVerviewForest.sorting = null;
    this.isErrorsFilter = false;
    this.refesh(false);
  }

  refesh(alert: boolean) {
    this.loading = true;
    this.lookForInfoService.getForestplotlist(this.filterOVerviewForest, 0, 10)
      .subscribe(result => {
        this.render(result);
      });
  }

  sortForestplotlist(fieldName: string) {
    if (fieldName !== this.currentSort) {
      this.currentSort = fieldName;
      this.orderBy = 'NoSort';
    }
    if (fieldName === this.currentSort && this.orderBy === 'NoSort') {
      this.orderBy = 'Asc';
    } else if (fieldName === this.currentSort && this.orderBy === 'Asc') {
      this.orderBy = 'Desc';
    } else if (fieldName === this.currentSort && this.orderBy === 'Desc') {
      this.orderBy = 'NoSort';
    }
    if (this.orderBy !== 'NoSort') {
      this.filterOVerviewForest.sorting = fieldName + this.orderBy;
    } else {
      this.filterOVerviewForest.sorting = '';
    }
    this.refesh(false);
  }

  viewDetailForest(item: OverviewForest) {
    this.lookForInfoService.detailsofTreeSpecies = item;
    this.lookForInfoService.filterList = this.filterOVerviewForest;
    this.lookForInfoService.currentPage = this.pagedResult.currentPage;
    this.lookForInfoService.pageSize = this.pagedResult.pageSize;
  }

  orderByField(fieldName: string) {
    if (fieldName !== this.currentSort) {
      this.currentSort = fieldName;
      this.orderBy = 'NoSort';
    }
    if (fieldName === this.currentSort && this.orderBy === 'NoSort') {
      this.orderBy = ' Asc';
    } else if (fieldName === this.currentSort && this.orderBy === ' Asc') {
      this.orderBy = ' Desc';
    } else if (fieldName === this.currentSort && this.orderBy === ' Desc') {
      this.orderBy = 'NoSort';
    }
    if (this.orderBy !== 'NoSort') {
      this.filterOVerviewForest.sorting = fieldName + this.orderBy;
    } else {
      this.filterOVerviewForest.sorting = '';
    }
    this.filter();
  }

  checkScroll() {
    setTimeout(_ => {
      window.addEventListener('scroll', e => {
        const elem = document.getElementsByClassName('ng-dropdown-panel')[0] as HTMLElement;
        if (elem && elem.getBoundingClientRect().top < 75) {
          elem.style.transform = 'translateY(115%)';
        }
      }, true);
    }, 500)
  }

  resolved(captchaResponse: string) {
    this.captchaResponse = captchaResponse;
  }

  openPopupGoogleMap(item) {
    // var address = (item.stateProvice ? item.stateProvice.text : '')
    //  + (item.district ?  item.district.text : '') 
    //  + (item.commune ? item.commune.text : ''); 
    // address gg
    let address = item.commune ? item.commune.text : '';
    if (address !== '' && item.district && item.district.text) {
      address = address + ' ' + item.district.text;
    }
    if (address !== '' && item.stateProvince && item.stateProvince.text) {
      address = address + ' ' + item.stateProvince.text;
    }
    // markerAddress 
    let markerAddress = item.commune ? item.commune.text : '';
    if (markerAddress !== '' && item.district && item.district.text) {
      markerAddress = markerAddress + ', ' + item.district.text;
    }
    if (markerAddress !== '' && item.stateProvince && item.stateProvince.text) {
      markerAddress = markerAddress + ', ' + item.stateProvince.text;
    }
    this.nbDialogService
      .open(GoogleMapComponent, {
        context: {
          id: item.commune && item.commune.key,
          address: address,
          locationLatitude: item.locationLatitudeCommune,
          locationLongitude: item.locationLongitudeCommune,
          markerAddress: markerAddress
        }
      })
      .onClose.subscribe(locationMap => {
        if (locationMap) {
          (this.pagedResult.items || []).forEach(itemCheck => {
            if (itemCheck.commune && locationMap.id && (+itemCheck.commune.key === locationMap.id)) {
              itemCheck.locationLatitudeCommune = locationMap.locationLatitude;
              itemCheck.locationLongitudeCommune = locationMap.locationLongitude;
            }
          })
        }
      }

      );
  }
}
