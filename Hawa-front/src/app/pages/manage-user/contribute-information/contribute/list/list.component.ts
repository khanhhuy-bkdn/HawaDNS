import { Component, OnInit } from '@angular/core';
import { DataGeneralService } from '../../../../../shared/service/data-general.service';
import { forkJoin } from 'rxjs';
import { AdministrativeUnit } from '../../../../../shared/model/dictionary/administrative-unit';
import { PagedResult } from '../../../../../shared/model/dictionary/paging-result.model';
import { ContributeInformation } from '../../../../../shared/model/contribute-information/contribute-information.model';
import { ContactListsIndirectlyAdminService } from '../../../../../shared/service/contact-lists-indirectly-admin.service';
import { FilterContactListIndirect } from '../../../../../shared/model/contact/filter-contact-list-indirect.model';
import { ContacListIndirect } from '../../../../../shared/model/contact/contact-list-indirect.model';
import { Router } from '@angular/router';

@Component({
  selector: 'list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  stateProvinces: AdministrativeUnit[];
  districts: AdministrativeUnit[];
  communes: AdministrativeUnit[];
  listOfCompartments: AdministrativeUnit[];
  pagedResult: PagedResult<ContacListIndirect> = new PagedResult<ContacListIndirect>();
  filterModel = new FilterContactListIndirect();
  loading: boolean;
  constructor(
    private dataGeneralService: DataGeneralService,
    private contactListsIndirectlyAdminService: ContactListsIndirectlyAdminService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loading = true;
    this.filterModel.stateProvinceId = '';
    this.filterModel.communeId = '';
    this.filterModel.districtId = '';
    if (this.contactListsIndirectlyAdminService.filterList) {
      this.filterModel = this.contactListsIndirectlyAdminService.filterList;
    }
    this.getMasterData();
    forkJoin(
      this.dataGeneralService.getProvinces(),
      this.contactListsIndirectlyAdminService.filterContactLists(this.filterModel, 0, 10)
    )
      .subscribe(([res1, res2]) => {
        this.stateProvinces = res1;
        if (this.filterModel.stateProvinceId && this.filterModel.stateProvinceId !== '') {
          const stateProvinceId = this.stateProvinces.filter(item => item.key == this.filterModel.stateProvinceId)[0];
          this.dataGeneralService.getDistricts(stateProvinceId.code).subscribe(data => {
            this.districts = data;
            if (this.filterModel.districtId && this.filterModel.districtId !== '') {
              const districtId = this.districts.filter(item => item.key == this.filterModel.districtId)[0];
              this.dataGeneralService.getWards(districtId.code).subscribe(data => {
                this.communes = data;
              });
            }
          });
        }
        this.render(res2);
      });
  }
  clearFilter() {
    this.filterModel = new FilterContactListIndirect();
    this.filter();
  }
  filter() {
    this.loading = true;
    this.contactListsIndirectlyAdminService
      .filterContactLists(this.filterModel, 0, this.pagedResult.pageSize)
      .subscribe(result => this.render(result));
  }
  pagedResultChange(pagedResult) {
    this.contactListsIndirectlyAdminService
      .filterContactLists(this.filterModel, pagedResult.currentPage, this.pagedResult.pageSize)
      .subscribe(result => this.render(result));
  }

  render(pagedResult) {
    this.loading = false;
    this.pagedResult = pagedResult;
  }

  getMasterData() {
    this.dataGeneralService.getMasterData.subscribe(masterData => {
      if (masterData && masterData.compartments) {
        this.listOfCompartments = masterData.compartments.map(item => ({
          key: item.key,
          code: item.code,
          text: item.text
        }));
      }
    })
  }

  getDistricts(provinceCode) {
    if (provinceCode === '') {
      this.filterModel.stateProvinceId = '';
      this.filterModel.communeId = '';
      this.filterModel.districtId = '';
    } else {
      const stateProvinceId = this.stateProvinces.filter(item => item.key == provinceCode)[0];
      this.dataGeneralService.getDistricts(stateProvinceId.code).subscribe(data => {
        this.districts = data;
      });
    }
    this.filterModel.districtId = '';
    this.communes = new Array<AdministrativeUnit>();
    this.filterModel.communeId = '';
  }

  getWards(provinceCode) {
    if (provinceCode === 'null') {
      this.filterModel.districtId = '';
    } else {
      const districtId = this.districts.filter(item => item.key == provinceCode)[0];
      this.dataGeneralService.getWards(districtId.code).subscribe(data => {
        this.communes = data;
      });
    }
    this.filterModel.communeId = '';
  }

  routerLink(communeId) {
    this.router.navigate([`/pages/contribute-information/contribute/detail/${communeId}`]);
    this.contactListsIndirectlyAdminService.filterList = this.filterModel;
  }
}
