import { Component, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { DataGeneralService } from '../../../shared/service/data-general.service';
import { AdministrativeUnit } from '../../../shared/model/dictionary/administrative-unit';
import { ManageBuyerService } from '../../../shared/service/manage-user-account/manage-buyer.service';
import { AlertService } from '../../../shared/service/alert.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { UserBuyerFilter } from '../../../shared/model/user-buyer/user-buyer-filter.model';
import { PagedResult } from '../../../shared/model/dictionary/paging-result.model';
import { UserBuyerItem } from '../../../shared/model/user-buyer/user-buyer-item.model';
import { ItemUnit } from '../../../shared/model/dictionary/item-unit.model';
import { PopupComponent } from '../../../shared/components/popups/popup/popup.component';
import { Router, ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'buyer',
  templateUrl: './buyer.component.html',
  styleUrls: ['./buyer.component.scss']
})
export class BuyerComponent implements OnInit {
  public sortParams = {
    nameAsc: 'ADUserOrganizationName Asc',
    nameDesc: 'ADUserOrganizationName Desc',
    typeAsc: 'ADUserType Asc',
    typeDesc: 'ADUserType Desc',
    emailAsc: 'ADUserEmail Asc',
    emailDesc: 'ADUserEmail Desc',
    stateProvinceAsc: 'GEStateProvince.GEStateProvinceName Asc',
    stateProvinceDesc: 'GEStateProvince.GEStateProvinceName Desc',
    districtAsc: 'GEDistrict.GEDistrictName Asc',
    districtDesc: 'GEDistrict.GEDistrictName Desc',
    communeAsc: 'GECommune.GECommuneName Asc',
    communeDesc: 'GECommune.GECommuneName Desc',
    statusAsc: 'ADUserStatus Asc',
    statusDesc: 'ADUserStatus Desc'
  };
  isShowListTable = true;
  isDisableDistrict = true;
  isDisableWard = true;
  listOfProvince: AdministrativeUnit[];
  listOfDistrict: AdministrativeUnit[];
  listOfWard: AdministrativeUnit[];
  searchTerm$ = new BehaviorSubject<string>('');
  userBuyerFilter = new UserBuyerFilter();
  pagedResult: PagedResult<UserBuyerItem> = new PagedResult<UserBuyerItem>();
  userBuyerList = new Array<UserBuyerItem>();
  userStatuss: ItemUnit[];
  userTypes: ItemUnit[];
  subscription: Subscription;
  searchInputValue: string = '';
  loading = false;
  loadingtable = false;
  isOnInit = false;
  constructor(
    private dataGeneralService: DataGeneralService,
    private dialogService: NbDialogService,
    private manageBuyerService: ManageBuyerService,
    private alertService: AlertService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getProvinces();
    this.getMasterData();
    this.subscription = this.manageBuyerService.followDirectToBuyer().subscribe(value => {
      if (value && this.isOnInit) {
        this.isShowListTable = true;
        this.filter();
      }
    });
    this.searchTerm$.pipe(
      debounceTime(600),
      distinctUntilChanged()
    ).subscribe(_ => {
      this.loadingtable = true;
      this.filter();
      this.isOnInit = true;
      // this.manageBuyerService
      //   .searchUserKeyWord(this.searchTerm$, this.userBuyerFilter, 0, this.pagedResult.pageSize)
      //   .subscribe(response => {
      //     this.loadingtable = false;
      //     this.rerender(response);
      //     this.isOnInit = true;
      //   }, err => {
      //     this.loadingtable = false;
      //     this.isOnInit = true;
      //   })
    })
    this.router.events.pipe(
      debounceTime(800)
    ).subscribe(_ => {
      if (this.router.routerState.snapshot.url == '/pages/buyer') {
        this.isShowListTable = true;
      }
    })
  }



  getProvinces() {
    this.dataGeneralService.getProvinces().subscribe(result => {
      this.listOfProvince = result;
    });
  }
  getDistricts(provinceCode) {
    this.isDisableWard = true;
    this.userBuyerFilter.communeID = '';
    this.userBuyerFilter.districtID = '';
    if (provinceCode === '') {
      this.isDisableDistrict = true;
    }
    if (provinceCode !== '') {
      this.isDisableDistrict = false;
      this.dataGeneralService.getDistricts(
        this.listOfProvince.find(province => province.key == provinceCode).code
      ).subscribe(result => this.listOfDistrict = result);
    }
  }
  getWards(districtCode) {
    this.userBuyerFilter.communeID = '';
    if (districtCode === '') {
      this.isDisableWard = true;
    }
    if (districtCode !== '') {
      this.isDisableWard = false;
      this.dataGeneralService.getWards(
        this.listOfDistrict.find(district => district.key == districtCode).code
      ).subscribe(result => this.listOfWard = result)
    }
  }
  getMasterData() {
    this.dataGeneralService.getMasterData.subscribe(masterData => {
      this.userStatuss = masterData.userStatues;
      this.userTypes = masterData.userTypes;
    })
  }

  // sort

  sortTable(sortColumn) {
    switch (sortColumn) {
      case 'name': {
        if (this.userBuyerFilter.sorting !== this.sortParams.nameAsc && this.userBuyerFilter.sorting !== this.sortParams.nameDesc) {
          this.userBuyerFilter.sorting = this.sortParams.nameAsc;
          return this.filter();
        }
        if (this.userBuyerFilter.sorting === this.sortParams.nameAsc) {
          this.userBuyerFilter.sorting = this.sortParams.nameDesc;
          return this.filter();
        }
        if (this.userBuyerFilter.sorting === this.sortParams.nameDesc) {
          this.userBuyerFilter.sorting = this.sortParams.nameAsc;
          return this.filter();
        }
      }
      case 'type': {
        if (this.userBuyerFilter.sorting !== this.sortParams.typeAsc && this.userBuyerFilter.sorting !== this.sortParams.typeDesc) {
          this.userBuyerFilter.sorting = this.sortParams.typeAsc;
          return this.filter();
        }
        if (this.userBuyerFilter.sorting === this.sortParams.typeAsc) {
          this.userBuyerFilter.sorting = this.sortParams.typeDesc;
          return this.filter();
        }
        if (this.userBuyerFilter.sorting === this.sortParams.typeDesc) {
          this.userBuyerFilter.sorting = this.sortParams.typeAsc;
          return this.filter();
        }
      }
      case 'email': {
        if (this.userBuyerFilter.sorting !== this.sortParams.emailAsc && this.userBuyerFilter.sorting !== this.sortParams.emailDesc) {
          this.userBuyerFilter.sorting = this.sortParams.emailAsc;
          return this.filter();
        }
        if (this.userBuyerFilter.sorting === this.sortParams.emailAsc) {
          this.userBuyerFilter.sorting = this.sortParams.emailDesc;
          return this.filter();
        }
        if (this.userBuyerFilter.sorting === this.sortParams.emailDesc) {
          this.userBuyerFilter.sorting = this.sortParams.emailAsc;
          return this.filter();
        }
      }
      case 'province': {
        if (this.userBuyerFilter.sorting !== this.sortParams.stateProvinceAsc && this.userBuyerFilter.sorting !== this.sortParams.stateProvinceDesc) {
          this.userBuyerFilter.sorting = this.sortParams.stateProvinceAsc;
          return this.filter();
        }
        if (this.userBuyerFilter.sorting === this.sortParams.stateProvinceAsc) {
          this.userBuyerFilter.sorting = this.sortParams.stateProvinceDesc;
          return this.filter();
        }
        if (this.userBuyerFilter.sorting === this.sortParams.stateProvinceDesc) {
          this.userBuyerFilter.sorting = this.sortParams.stateProvinceAsc;
          return this.filter();
        }
      }
      case 'district': {
        if (this.userBuyerFilter.sorting !== this.sortParams.districtAsc && this.userBuyerFilter.sorting !== this.sortParams.districtDesc) {
          this.userBuyerFilter.sorting = this.sortParams.districtAsc;
          return this.filter();
        }
        if (this.userBuyerFilter.sorting === this.sortParams.districtAsc) {
          this.userBuyerFilter.sorting = this.sortParams.districtDesc;
          return this.filter();
        }
        if (this.userBuyerFilter.sorting === this.sortParams.districtDesc) {
          this.userBuyerFilter.sorting = this.sortParams.districtAsc;
          return this.filter();
        }
      }
      case 'ward': {
        if (this.userBuyerFilter.sorting !== this.sortParams.communeAsc && this.userBuyerFilter.sorting !== this.sortParams.communeDesc) {
          this.userBuyerFilter.sorting = this.sortParams.communeAsc;
          return this.filter();
        }
        if (this.userBuyerFilter.sorting === this.sortParams.communeAsc) {
          this.userBuyerFilter.sorting = this.sortParams.communeDesc;
          return this.filter();
        }
        if (this.userBuyerFilter.sorting === this.sortParams.communeDesc) {
          this.userBuyerFilter.sorting = this.sortParams.communeAsc;
          return this.filter();
        }
      }
      case 'status': {
        if (this.userBuyerFilter.sorting !== this.sortParams.statusAsc && this.userBuyerFilter.sorting !== this.sortParams.statusDesc) {
          this.userBuyerFilter.sorting = this.sortParams.statusAsc;
          return this.filter();
        }
        if (this.userBuyerFilter.sorting === this.sortParams.statusAsc) {
          this.userBuyerFilter.sorting = this.sortParams.statusDesc;
          return this.filter();
        }
        if (this.userBuyerFilter.sorting === this.sortParams.statusDesc) {
          this.userBuyerFilter.sorting = this.sortParams.statusAsc;
          return this.filter();
        }
      }
    }
  }

  filter() {
    this.loadingtable = true;
    this.manageBuyerService
      .filterUserList(this.searchTerm$.value, this.userBuyerFilter, 0, this.pagedResult.pageSize ? this.pagedResult.pageSize : 10)
      .subscribe(result => {
        this.rerender(result);
        this.loadingtable = false;
      }, err => {
        this.loadingtable = false;
      });
  }
  clearFilter() {
    this.userBuyerFilter = new UserBuyerFilter();
    this.filter();
  }
  rerender(pagedResult: PagedResult<UserBuyerItem>) {
    this.userBuyerList = pagedResult.items;
    this.pagedResult = pagedResult;
  }
  pagedResultChange(pagedResult) {
    this.manageBuyerService
      .filterUserList(this.searchTerm$.value, this.userBuyerFilter, pagedResult.currentPage, pagedResult.pageSize)
      .subscribe(result => {
        this.rerender(result);
      });
  }
  redirectToOther() {
    this.isShowListTable = false;
    // this.searchInputValue = this.searchTerm$.value;
  }
  onSelectAll(value: boolean) {
    this.userBuyerList.forEach(x => (x['checked'] = value));
  }

  deActiveUsers(userStatus, userId, index) {
    const usersDelete = this.userBuyerList.filter(user => user.checked === true);
    if (usersDelete.length > 0) {
      return this.deleteMultiUsers(usersDelete);
    } else {
      this.dialogService
        .open(PopupComponent, {
          context: {
            showModel: {
              title: 'Vô hiệu hoá người dùng',
              notices: [
                'Bạn có chắc muốn vô hiệu hoá người dùng này?'
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
            this.manageBuyerService
              .deleteUser(userId)
              .subscribe(res => {
                this.alertService.success('Vô hiệu hoá người dùng thành công.');
                this.manageBuyerService
                  .filterUserList(this.searchTerm$.value, this.userBuyerFilter, this.pagedResult.currentPage, this.pagedResult.pageSize)
                  .subscribe(result => {
                    this.rerender(result);
                  });
                // this.userBuyerList.splice(index, 1);
              },
                err => this.alertService.error('Đã có lỗi. Xin vui lòng thử lại'));
          }
        });
    }
  }

  deleteMultiUsers(usersDelete) {
    // const isCanDelete = usersDelete.every(user => (user.status && user.status.code === 'Inactive'));
    const userIds = usersDelete.map(user => user.id);
    // if (!isCanDelete) {
    //   return this.alertService.error('Chỉ có thể xóa những người dùng Không hoạt động.');
    // }
    this.manageBuyerService.deleteMultiUsers(userIds).subscribe(_ => this.alertService.success('Đã xóa thành công.'),
      err => this.alertService.error('Đã có lỗi. Xin vui lòng thử lại.'));

  }

  approveUser(userId) {
    this.dialogService.open(PopupComponent, {
      context: {
        showModel: {
          title: 'phê duyệt cấp tài khoản',
          notices: [
            'Bằng cách chọn Duyệt, bạn sẽ đồng ý chấp thuận <br /> cho tài khoản này đăng nhập vào hệ thống?'
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
        }
      }
    }).onClose.subscribe(agreed => {
      if (agreed) {
        this.manageBuyerService
          .confirmAccountByAdmin(userId)
          .subscribe(_ => {
            this.alertService.success('Đã duyệt tài khoản người dùng.');
            this.filter();
          }, err => this.alertService.error('Xin vui lòng thử lại.'))
      }
    });
  }

  resetPassword(userId) {
    this.dialogService
      .open(PopupComponent, {
        context: {
          showModel: {
            title: 'đặt lại mật khẩu người dùng',
            notices: [
              'Bạn có chắc muốn đặt lại mật khẩu của người dùng này?'
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
          }
        }
      })
      .onClose.subscribe(isResetPassword => {
        if (isResetPassword) {
          this.loading = true;
          this.manageBuyerService.resetPasswordByAdmin(userId).subscribe(newPassword => {
            this.loading = false;
            if (newPassword) {
              this.dialogService
                .open(PopupComponent, {
                  context: {
                    showModel: {
                      title: 'đặt lại mật khẩu người dùng',
                      notices: [
                        'Mật khẩu người dùng đã được đặt lại thành công.',
                        `Mật khẩu mới là: <strong>${newPassword}</strong>`
                      ],
                      actions: [
                        {
                          actionname: 'ok',
                          actionvalue: true,
                          actiontype: ''
                        }
                      ]
                    }
                  }
                })
            }
          }, err => {
            this.loading = false;
            this.alertService.error('Đã có lỗi. Xin vui lòng thử lại');
          })
        }
      })
  }

}
