import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StateProvinceService } from '../../../../shared/service/setting/state-province/state-province.service';
import { FilterStateProvince } from '../../../../shared/model/setting/state-province/filter-state-province.model';
import { PagedResult } from '../../../../shared/model/dictionary/paging-result.model';
import { StateProvinceList } from '../../../../shared/model/setting/state-province/state-province-list.model';
import { AlertService } from '../../../../shared/service/alert.service';

@Component({
  selector: 'province-city',
  templateUrl: './province-city.component.html',
  styleUrls: ['./province-city.component.scss']
})
export class ProvinceCityComponent implements OnInit {
  pagedResult: PagedResult<StateProvinceList> = new PagedResult<StateProvinceList>();
  searchTerm$ = new BehaviorSubject<string>('');
  filterText = '';
  filterModel = new FilterStateProvince();
  loading = false;
  constructor(
    private stateProvinceService: StateProvinceService,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
    this.filterModel.isHidden = null;
    this.loading = true;
    this.stateProvinceService.searchKeyWordGetStateProvinceList(
      this.searchTerm$, this.filterModel, 0, 10
    ).subscribe(response => {
      this.render(response);
      this.loading = false;
    })
  }

  render(pagedResult) {
    this.pagedResult = pagedResult;
  }

  filter() {
    this.loading = true;
    this.stateProvinceService.getStateProvinceListFilter(this.searchTerm$.value, this.filterModel, 0, 10).subscribe(response => {
      this.render(response);
      this.loading = false;
    })
  }

  clearFilter() {
    this.filterModel.isHidden = null;
    this.stateProvinceService.getStateProvinceListFilter(this.searchTerm$.value, this.filterModel, 0, 10).subscribe(response => {
      this.render(response);
    })
  }

  pagedResultChange(pagedResult) {
    this.loading = true;
    this.stateProvinceService.getStateProvinceListFilter(this.searchTerm$.value, this.filterModel, pagedResult.currentPage, pagedResult.pageSize).subscribe(response => {
      this.render(response);
      this.loading = false;
    })
  }

  changeActive(stateProvinceId: number, status: boolean) {
    if (status) {
      this.stateProvinceService.showStateProvince(stateProvinceId).subscribe(response => {
        (this.pagedResult.items || []).forEach(item => {
          if (item.id === stateProvinceId) {
            item.isHidden = !status;
          }
        })
        // this.filter();
        this.alertService.success('Hiện Tỉnh/Thành phố thành công');
      }, err => {
        this.alertService.error('Đã xảy ra lỗi. Hiện Tỉnh/Thành phố không thành công');
      });
    } else {
      this.stateProvinceService.hideStateProvince(stateProvinceId).subscribe(response => {
        (this.pagedResult.items || []).forEach(item => {
          if (item.id === stateProvinceId) {
            item.isHidden = !status;
          }
        });
        // this.filter();
        this.alertService.success('Ẩn Tỉnh/Thành phố thành công');
      }, err => {
        this.alertService.error('Đã xảy ra lỗi. Ẩn Tỉnh/Thành phố không thành công');
      });
    }
  }

}
