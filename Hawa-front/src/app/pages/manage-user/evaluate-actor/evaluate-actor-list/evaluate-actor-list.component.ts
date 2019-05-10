import { Component, OnInit } from '@angular/core';
import { FilterEvaluateContactListManager } from '../../../../shared/model/evaluate-contact/filter-evaluate-contact-list-manager.model';
import { Router } from '@angular/router';
import { ManageEvaluateService } from '../../../../shared/service/manage-user-account/manage-evaluate.service';
import { DataGeneralService } from '../../../../shared/service/data-general.service';
import { AdministrativeUnit } from '../../../../shared/model/dictionary/administrative-unit';
import { EvaluateActorFilterManager } from '../../../../shared/model/evaluate-actor/evaluate-actor-filter-manager.model';
import { EMPTY } from 'rxjs';
import { ThemeSettingsComponent } from '../../../../@theme/components';
import { PagedResult } from '../../../../shared/model/dictionary/paging-result.model';
import { EvaluateActorListManager } from '../../../../shared/model/evaluate-actor/evaluate-actor-list-manager.model';

@Component({
  selector: 'evaluate-actor-list',
  templateUrl: './evaluate-actor-list.component.html',
  styleUrls: ['./evaluate-actor-list.component.scss']
})
export class EvaluateActorListComponent implements OnInit {
  filterModel = new EvaluateActorFilterManager();
  stateProvinces: AdministrativeUnit[];
  districts: AdministrativeUnit[];
  communes: AdministrativeUnit[];
  compartments: AdministrativeUnit[];
  subCompartments: AdministrativeUnit[];
  pagedResult: PagedResult<EvaluateActorListManager> = new PagedResult<EvaluateActorListManager>();
  constructor(
    private router: Router,
    private manageEvaluateService: ManageEvaluateService,
    private dataGeneralService: DataGeneralService
  ) { }

  ngOnInit() {
    if (this.manageEvaluateService.filterModelListActor) {
      this.filterModel.stateProvinceId = this.manageEvaluateService.filterModelListActor.stateProvinceId;
      this.filterModel.districtId = this.manageEvaluateService.filterModelListActor.districtId;
      this.filterModel.communeId = this.manageEvaluateService.filterModelListActor.communeId;
      this.filterModel.compartmentId = this.manageEvaluateService.filterModelListActor.compartmentId;
      this.filterModel.subCompartmentId = this.manageEvaluateService.filterModelListActor.subCompartmentId;
    } else {
      this.filterModel.stateProvinceId = null;
      this.filterModel.districtId = null;
      this.filterModel.communeId = null;
      this.filterModel.compartmentId = null;
      this.filterModel.subCompartmentId = null;
    }
    this.dataGeneralService.getProvinces().switchMap(data => {
      this.stateProvinces = data;

      if (this.manageEvaluateService.filterModelListActor) {
        if (this.manageEvaluateService.filterModelListActor.stateProvinceId) {
          const stateProvinces = this.stateProvinces.filter(item => item.key == this.manageEvaluateService.filterModelListActor.stateProvinceId.toString())[0];
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
        if (this.manageEvaluateService.filterModelListActor.districtId) {
          const districtID = this.districts.filter(item => item.key == this.manageEvaluateService.filterModelListActor.districtId.toString())[0];
          if (this.filterModel.districtId) {
            return this.dataGeneralService.getWards(districtID.code)
          }
        } else {
          return EMPTY;
        }
      }).switchMap(dataCommunes => {
        this.communes = dataCommunes;
        if (this.manageEvaluateService.filterModelListActor.communeId) {
          // const communeId = this.communes.filter(item => item.key == this.manageEvaluateService.filterModelListActor.communeId.toString())[0];
          if (this.filterModel.communeId) {
            return this.dataGeneralService.getCompartments(this.manageEvaluateService.filterModelListActor.communeId)
          }
        } else {
          return EMPTY;
        }
      })
      .switchMap(dataCompartments => {
        this.compartments = dataCompartments;
        if (this.manageEvaluateService.filterModelListActor.subCompartmentId) {
          // const subCompartmentId = this.compartments.filter(item => item.key == this.manageEvaluateService.filterModelListActor.compartmentId.toString())[0];
          if (this.filterModel.compartmentId) {
            return this.dataGeneralService.getSubCompartments(this.manageEvaluateService.filterModelListActor.subCompartmentId)
          }
        } else {
          return EMPTY;
        }
      })
      .subscribe(dataSubCompartments => {
        this.subCompartments = dataSubCompartments;
      })
    this.manageEvaluateService.actorListForEvaluate(this.filterModel,
      this.manageEvaluateService.currentPageActor ? this.manageEvaluateService.currentPageActor : 0,
      this.manageEvaluateService.pageSizeActor ? this.manageEvaluateService.pageSizeActor : 10).subscribe(response => {
        this.render(response);
      })
  }

  render(pagedResult) {
    this.pagedResult = pagedResult;
    (this.pagedResult.items || []).forEach(item => {
      item.averageRating = +item.averageRating.toFixed(1);
    })
  }

  viewDetail(forestPlotId) {
    this.manageEvaluateService.filterModelListActor = this.filterModel;
    this.manageEvaluateService.currentPageActor = this.pagedResult.currentPage;
    this.manageEvaluateService.pageSizeActor = this.pagedResult.pageSize;
    this.router.navigate([`/pages/evaluate-actor/detail/${forestPlotId}`]);
  }

  getDistricts(provinceCode) {
    if (provinceCode === 'null') {
      this.filterModel.stateProvinceId = null;
    }
    const stateProvinces = this.stateProvinces.filter(item => item.key == provinceCode)[0];
    if (this.filterModel.stateProvinceId) {
      this.dataGeneralService.getDistricts(stateProvinces.code).subscribe(data => {
        this.districts = data;
      });
    }
    this.filterModel.districtId = null;
    this.communes = new Array<AdministrativeUnit>();
    this.filterModel.communeId = null;
  }

  getWards(provinceCode) {
    if (provinceCode === 'null') {
      this.filterModel.districtId = null;
    }
    const districtID = this.districts.filter(item => item.key == provinceCode)[0];
    if (this.filterModel.districtId) {
      this.dataGeneralService.getWards(districtID.code).subscribe(data => {
        this.communes = data;
      });
    }
    this.filterModel.communeId = null;
  }

  getCompartments(provinceCode) {
    if (provinceCode === 'null') {
      this.filterModel.communeId = null;
    }
    // const communeId = this.communes.filter(item => item.key == provinceCode)[0];
    if (this.filterModel.communeId) {
      this.dataGeneralService.getCompartments(this.filterModel.communeId).subscribe(data => {
        this.compartments = data;
      });
    }
    this.filterModel.compartmentId = null;
  }

  getSubcompartments(provinceCode) {
    if (provinceCode === 'null') {
      this.filterModel.compartmentId = null;
    }
    // const compartmentId = this.compartments.filter(item => item.key == provinceCode)[0];
    if (this.filterModel.compartmentId) {
      this.dataGeneralService.getSubCompartments(this.filterModel.compartmentId).subscribe(data => {
        this.subCompartments = data;
      });
    }
    this.filterModel.subCompartmentId = null;
  }

  filter() {
    this.manageEvaluateService.actorListForEvaluate(this.filterModel, 0, 10).subscribe(response => {
      this.render(response);
    })
  }

  clearFilter() {
    this.filterModel.stateProvinceId = null;
    this.filterModel.districtId = null;
    this.filterModel.communeId = null;
    this.filterModel.compartmentId = null;
    this.filterModel.subCompartmentId = null;
    this.filterModel.plotCode = null;
    this.filter();
  }

  pagedResultChange(pagedResult) {
    this.manageEvaluateService.actorListForEvaluate(this.filterModel, pagedResult.currentPage, pagedResult.pageSize).subscribe(response => {
      this.render(response);
    })
  }

}
