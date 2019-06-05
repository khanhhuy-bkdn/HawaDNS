import { Component, OnInit, ViewChild } from '@angular/core';
import { FilterEvaluateContactListManager } from '../../../../shared/model/evaluate-contact/filter-evaluate-contact-list-manager.model';
import { Router } from '@angular/router';
import { ManageEvaluateService } from '../../../../shared/service/manage-user-account/manage-evaluate.service';
import { DataGeneralService } from '../../../../shared/service/data-general.service';
import { AdministrativeUnit } from '../../../../shared/model/dictionary/administrative-unit';
import { EMPTY, BehaviorSubject, Observable } from 'rxjs';
import { ThemeSettingsComponent } from '../../../../@theme/components';
import { PagedResult } from '../../../../shared/model/dictionary/paging-result.model';
import { EvaluateActorListManager } from '../../../../shared/model/evaluate-actor/evaluate-actor-list-manager.model';
import { ImportDataActorService } from '../../../../shared/service/actor/import-data-actor.service';
import { AlertService } from '../../../../shared/service/alert.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import * as XLSX from 'ts-xlsx';
import { ItemUnit } from '../../../../shared/model/dictionary/item-unit.model';
import { ActorFilterManager } from '../../../../shared/model/actor/actor-filter-manager.model';
import { ActorGenModel } from '../../../../shared/model/actor/actor-gen.model';
@Component({
  selector: 'evaluate-actor-list-actor',
  templateUrl: './evaluate-actor-list-actor.component.html',
  styleUrls: ['./evaluate-actor-list-actor.component.scss']
})
export class EvaluateActorListActorComponent implements OnInit {
  @ViewChild('importDataActor') importDataActor;
  filterModel = new ActorFilterManager();
  stateProvinces: AdministrativeUnit[];
  districts: AdministrativeUnit[];
  communes: AdministrativeUnit[];
  compartments: AdministrativeUnit[];
  subCompartments: AdministrativeUnit[];
  pagedResult: PagedResult<ActorGenModel> = new PagedResult<ActorGenModel>();
  loading = false;
  searchTerm$ = new BehaviorSubject<string>('');
  isOnInit = false;
  loadingtable = false;

  arrayBuffer: any;
  currentRow: number;
  constructor(
    private router: Router,
    private manageEvaluateService: ManageEvaluateService,
    private dataGeneralService: DataGeneralService,
    private importDataActorService: ImportDataActorService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    if (this.manageEvaluateService.filterModelListActor) {
      this.filterModel.stateProvinceId = this.manageEvaluateService.filterModelListActor.stateProvinceId;
      this.filterModel.districtId = this.manageEvaluateService.filterModelListActor.districtId;
      this.filterModel.communeId = this.manageEvaluateService.filterModelListActor.communeId;
    } else {
      this.filterModel.stateProvinceId = null;
      this.filterModel.districtId = null;
      this.filterModel.communeId = null;
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
      }).subscribe(dataSubCompartments => {
        this.subCompartments = dataSubCompartments;
      })

    if (this.manageEvaluateService.pageSizeActor) {
      this.pagedResult.pageSize = this.manageEvaluateService.pageSizeActor
    }
    this.searchTerm$.next(this.manageEvaluateService.searchTermActor ? this.manageEvaluateService.searchTermActor : '');

    this.searchTerm$.pipe(
      debounceTime(600),
      distinctUntilChanged()
    ).subscribe(keyword => {
      this.loadingtable = true;
      this.manageEvaluateService.actorList(this.searchTerm$.value, this.filterModel,
        (!this.isOnInit && this.manageEvaluateService.currentPageActor) ? this.manageEvaluateService.currentPageActor : 0,
        this.pagedResult.pageSize ? this.pagedResult.pageSize : 10).subscribe(response => {
          this.render(response);
        })
      this.isOnInit = true;
    });
  }

  render(pagedResult) {
    this.pagedResult = pagedResult;
    console.log(this.pagedResult)
    this.loadingtable = false;
  }

  viewDetail(actorId) {
    console.log(actorId)
    this.manageEvaluateService.filterModelListActorReview = this.filterModel;
    //this.manageEvaluateService.currentPageActor = this.pagedResult.currentPage;
    //this.manageEvaluateService.pageSizeActor = this.pagedResult.pageSize;
    //this.manageEvaluateService.searchTermActor = this.searchTerm$.value;
    this.router.navigate([`/pages/evaluate-actor/list/${actorId}`]);
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

  filter() {
    this.loadingtable = true;
    this.manageEvaluateService.actorList(
      this.searchTerm$.value,
      this.filterModel
      , this.pagedResult && this.pagedResult.currentPage ? this.pagedResult.currentPage : 0
      , this.pagedResult && this.pagedResult.pageSize ? this.pagedResult.pageSize : 10).subscribe(response => {
        this.render(response);
      })
  }

  clearFilter() {
    this.filterModel.stateProvinceId = null;
    this.filterModel.districtId = null;
    this.filterModel.communeId = null;
    this.filter();
  }

  pagedResultChange(pagedResult) {
    this.manageEvaluateService.actorList(this.searchTerm$.value, this.filterModel, pagedResult.currentPage, pagedResult.pageSize).subscribe(response => {
      this.render(response);
    })
  }
}

