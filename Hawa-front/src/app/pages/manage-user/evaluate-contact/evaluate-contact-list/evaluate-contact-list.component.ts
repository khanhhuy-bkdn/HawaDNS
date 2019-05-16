import { Component, OnInit } from '@angular/core';
import { EvaluateContactFilter } from '../../../../shared/model/evaluate-contact/evaluate-contact-filter';
import { BehaviorSubject, EMPTY } from 'rxjs';
import { ManageEvaluateService } from '../../../../shared/service/manage-user-account/manage-evaluate.service';
import { FilterEvaluateContactListManager } from '../../../../shared/model/evaluate-contact/filter-evaluate-contact-list-manager.model';
import { PagedResult } from '../../../../shared/model/dictionary/paging-result.model';
import { ReviewContactList } from '../../../../shared/model/contact/review-contact-list.model';
import { DataGeneralService } from '../../../../shared/service/data-general.service';
import { AdministrativeUnit } from '../../../../shared/model/dictionary/administrative-unit';
import { ListEvaluateContact } from '../../../../shared/model/evaluate-contact/list-evaluate-contact.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'evaluate-contact-list',
  templateUrl: './evaluate-contact-list.component.html',
  styleUrls: ['./evaluate-contact-list.component.scss']
})
export class EvaluateContactListComponent implements OnInit {
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
  evaluateContactFilter = new EvaluateContactFilter();
  searchTerm$ = new BehaviorSubject<string>('');
  filterModel = new FilterEvaluateContactListManager();
  pagedResult: PagedResult<ListEvaluateContact> = new PagedResult<ListEvaluateContact>();
  stateProvinces: AdministrativeUnit[];
  districts: AdministrativeUnit[];
  communes: AdministrativeUnit[];
  loading: boolean;
  constructor(
    private manageEvaluateService: ManageEvaluateService,
    private dataGeneralService: DataGeneralService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    if (this.manageEvaluateService.filterModelListContact) {
      this.filterModel.contactStateProvinceId = this.manageEvaluateService.filterModelListContact.contactStateProvinceId;
      this.filterModel.contactDistrictId = this.manageEvaluateService.filterModelListContact.contactDistrictId;
      this.filterModel.contactCommuneId = this.manageEvaluateService.filterModelListContact.contactCommuneId;
    } else {
      this.filterModel.contactStateProvinceId = null;
      this.filterModel.contactDistrictId = null;
      this.filterModel.contactCommuneId = null;
    }
    this.loading = true;
    this.dataGeneralService.getProvinces().switchMap(data => {
      this.stateProvinces = data;
      if (this.manageEvaluateService.filterModelListContact) {
        if (this.manageEvaluateService.filterModelListContact.contactStateProvinceId) {
          const stateProvinces = this.stateProvinces.filter(item => item.key == this.manageEvaluateService.filterModelListContact.contactStateProvinceId.toString())[0];
          return this.dataGeneralService.getDistricts(stateProvinces.code)
        } else {
          return EMPTY;
        }
      } else {
        return EMPTY;
      }
    })
      .switchMap(dataDistrict => {
        this.districts = dataDistrict;
        if (this.manageEvaluateService.filterModelListContact.contactDistrictId) {
          const districtID = this.districts.filter(item => item.key == this.manageEvaluateService.filterModelListContact.contactDistrictId.toString())[0];
          if (this.filterModel.contactDistrictId) {
            return this.dataGeneralService.getWards(districtID.code)
          }
        } else {
          return EMPTY;
        }
      }).subscribe(dataCommunes => {
        this.communes = dataCommunes;
      })

    this.manageEvaluateService.contactListForEvaluate(this.filterModel,
      this.manageEvaluateService.currentPageContact ? this.manageEvaluateService.currentPageContact : 0,
      this.manageEvaluateService.pageSizeContact ? this.manageEvaluateService.pageSizeContact : 10).subscribe(response => {
        this.render(response);
      })
  }

  render(pagedResult) {
    this.loading = false;
    this.pagedResult = pagedResult;
    (this.pagedResult.items || []).forEach( item => {
      item.averageRating = +item.averageRating.toFixed(1);
    })
  }

  sortTable(sortColumn) {
    switch (sortColumn) {
      case 'name': {
        if (this.evaluateContactFilter.sort !== this.sortParams.nameAsc && this.evaluateContactFilter.sort !== this.sortParams.nameDesc) {
          this.evaluateContactFilter.sort = this.sortParams.nameAsc;
          // return this.filter();
        }
        if (this.evaluateContactFilter.sort === this.sortParams.nameAsc) {
          this.evaluateContactFilter.sort = this.sortParams.nameDesc;
          // return this.filter();
        }
        if (this.evaluateContactFilter.sort === this.sortParams.nameDesc) {
          this.evaluateContactFilter.sort = this.sortParams.nameAsc;
          // return this.filter();
        }
      }
      case 'evaluator': {
        if (this.evaluateContactFilter.sort !== this.sortParams.typeAsc && this.evaluateContactFilter.sort !== this.sortParams.typeDesc) {
          this.evaluateContactFilter.sort = this.sortParams.typeAsc;
          // return this.filter();
        }
        if (this.evaluateContactFilter.sort === this.sortParams.typeAsc) {
          this.evaluateContactFilter.sort = this.sortParams.typeDesc;
          // return this.filter();
        }
        if (this.evaluateContactFilter.sort === this.sortParams.typeDesc) {
          this.evaluateContactFilter.sort = this.sortParams.typeAsc;
          // return this.filter();
        }
      }
      case 'date': {
        if (this.evaluateContactFilter.sort !== this.sortParams.emailAsc && this.evaluateContactFilter.sort !== this.sortParams.emailDesc) {
          this.evaluateContactFilter.sort = this.sortParams.emailAsc;
          // return this.filter();
        }
        if (this.evaluateContactFilter.sort === this.sortParams.emailAsc) {
          this.evaluateContactFilter.sort = this.sortParams.emailDesc;
          // return this.filter();
        }
        if (this.evaluateContactFilter.sort === this.sortParams.emailDesc) {
          this.evaluateContactFilter.sort = this.sortParams.emailAsc;
          // return this.filter();
        }
      }
      case 'average': {
        if (this.evaluateContactFilter.sort !== this.sortParams.stateProvinceAsc && this.evaluateContactFilter.sort !== this.sortParams.stateProvinceDesc) {
          this.evaluateContactFilter.sort = this.sortParams.stateProvinceAsc;
          // return this.filter();
        }
        if (this.evaluateContactFilter.sort === this.sortParams.stateProvinceAsc) {
          this.evaluateContactFilter.sort = this.sortParams.stateProvinceDesc;
          // return this.filter();
        }
        if (this.evaluateContactFilter.sort === this.sortParams.stateProvinceDesc) {
          this.evaluateContactFilter.sort = this.sortParams.stateProvinceAsc;
          // return this.filter();
        }
      }
    }
  }

  getDistricts(provinceCode) {
    if (provinceCode === 'null') {
      this.filterModel.contactStateProvinceId = null;
    }
    const stateProvinces = this.stateProvinces.filter(item => item.key == provinceCode)[0];
    if (this.filterModel.contactStateProvinceId) {
      this.dataGeneralService.getDistricts(stateProvinces.code).subscribe(data => {
        this.districts = data;
      });
    }
    this.filterModel.contactDistrictId = null;
    this.communes = new Array<AdministrativeUnit>();
    this.filterModel.contactCommuneId = null;
  }

  getWards(provinceCode) {
    if (provinceCode === 'null') {
      this.filterModel.contactDistrictId = null;
    }
    const districtID = this.districts.filter(item => item.key == provinceCode)[0];
    if (this.filterModel.contactDistrictId) {
      this.dataGeneralService.getWards(districtID.code).subscribe(data => {
        this.communes = data;
      });
    }
    this.filterModel.contactCommuneId = null;
  }

  pagedResultChange(pagedResult) {
    this.manageEvaluateService.contactListForEvaluate(this.filterModel, pagedResult.currentPage, pagedResult.pageSize).subscribe(response => {
      this.render(response);
    })
  }

  filter() {
    this.loading = true;
    this.manageEvaluateService.contactListForEvaluate(this.filterModel, 0, 10).subscribe(response => {
      this.render(response);
    })
  }

  clearFilter() {
    this.filterModel.contactStateProvinceId = null;
    this.filterModel.contactDistrictId = null;
    this.filterModel.contactCommuneId = null;
    this.filterModel.rating = null;
    this.filter();
  }

  viewDetail(idEvaluate) {
    this.manageEvaluateService.filterModelListContact = this.filterModel;
    this.manageEvaluateService.currentPageContact = this.pagedResult.currentPage;
    this.manageEvaluateService.pageSizeContact = this.pagedResult.pageSize;
    this.router.navigate([`/pages/evaluate-contact/detail/${idEvaluate}`], {
      queryParams: {
        stateProvinces: this.filterModel.contactStateProvinceId,
        districts: this.filterModel.contactDistrictId,
        communes: this.filterModel.contactCommuneId,
      }
    });
  }
}
