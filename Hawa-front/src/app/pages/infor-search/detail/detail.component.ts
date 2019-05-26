import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { NbDialogService } from '@nebular/theme/components/dialog/dialog.service';
import { ActorPopupComponent } from '../../../shared/components/popups/actor-popup/actor-popup.component';
import { PagedResult } from '../../../shared/model/dictionary/paging-result.model';
import { forkJoin, Subscription, BehaviorSubject } from 'rxjs';
import { DataGeneralService } from '../../../shared/service/data-general.service';
import { TreespecsList } from '../../../shared/model/treespecs-list.model';
import { FilteForestSpecailOrCoomune } from '../../../shared/model/filter-forest-specailOrCoomune.model';
import { Router, ActivatedRoute } from '@angular/router';
import { InformationIndirectComponent } from '../../../shared/components/popups/information-indirect/information-indirect.component';
import { Dictionary } from '../../../shared/model/dictionary/dictionary.model';
import { LookForInfoService } from '../../../shared/service/look-for-info.service';
import { ForestSpecailOrCommune } from '../../../shared/model/forest-specailOrCommune.model';
import { OverviewForest } from '../../../shared/model/overview-forest.model';
import { Administration } from '../../../shared/model/forest-plot/administration.model';
import { LoginRequiredComponent } from '../../../shared/components/popups/login-required/login-required.component';
import { SessionService } from '../../../shared/service/session.service';
import { NouisliderModule } from 'ng2-nouislider';
import { Options } from 'ng5-slider';
import { TreeSpeciesComponent } from '../../../shared/components/popups/tree-species/tree-species.component';
import { CreateTreeSpeciesComponent } from '../../../shared/components/popups/create-tree-species/create-tree-species.component';
import { GoogleMapComponent } from '../../../shared/components/popups/google-map/google-map.component';
import { SavePageToLoginRequiredService } from '../../../shared/service/save-page-to-login-required.service';
import { RecaptchaComponent } from 'ng-recaptcha';
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  @ViewChild('slider', { read: ElementRef }) slider: ElementRef;
  @Input() callBack: Function;
  pagedResult: Administration<ForestSpecailOrCommune> = new Administration<ForestSpecailOrCommune>();
  treespecsList: TreespecsList[];
  filterModel = new FilteForestSpecailOrCoomune();
  certificateList: Dictionary[];
  forestplotReliability: Dictionary[];
  queryParamsSubscription: Subscription;
  searchTerm$ = new BehaviorSubject<string>('');
  detailsofTreeSpecies: OverviewForest;
  currentSort = '';
  orderBy = '';
  treeSpecGroupId: number;
  yearoldsTreeSpec: number[];
  someRange;
  maxRange = 0;
  someKeyboardConfig: any = {
    behaviour: 'drag',
    connect: true,
    keyboard: false,
  };
  isShowRangeBar = false;
  commune;
  showFilterYear = false;
  minValue = 0;
  maxValue = 0;
  options: Options = {
    floor: 0,
    ceil: null,
    step: 1,
    showTicks: true,
  };
  loading = false;
  isOldToReturnPageLogin: number = null;
  admin = false;
  constructor(
    private nbDialogService: NbDialogService,
    private dataGeneralService: DataGeneralService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private lookForInfoService: LookForInfoService,
    private sessionService: SessionService,
    private noUiSlider: NouisliderModule,
    private savePageToLoginRequiredService: SavePageToLoginRequiredService,
  ) { }

  ngOnInit() {

    this.loading = true;
    this.filterModel.forestCertID = null;
    this.filterModel.treeSpecies = null;
    this.filterModel.oldFrom = 0;
    this.filterModel.reliability = null;
    this.filterModel.sorting = null;
    this.filterModel.treeSpecID = null;
    this.detailsofTreeSpecies = this.lookForInfoService.detailsofTreeSpecies;
    this.queryParamsSubscription = this.activatedRoute.params.subscribe(data => {
      this.filterModel.communeID = data.communeID;
      this.commune = data.communeID;
      this.filterModel.treeSpecID = data.treeSpecID;
      this.filterModel.sorting = 'GECompartmentCode Asc';
    });
    this.checkPageReturn();
    forkJoin(
      this.dataGeneralService.getMasterData,
      this.lookForInfoService.getYearoldsTree(+this.filterModel.treeSpecID, +this.filterModel.communeID),
      // this.dataGeneralService.getTreespecs(this.filterModel.treeSpecGroupID, 0, 1000),
    )
      .subscribe(([res1, res2]) => {
        // this.treespecsList = res1.items;
        this.certificateList = res1.forestCerts;
        this.forestplotReliability = res1.forestplotReliability;
        this.yearoldsTreeSpec = res2;
        // if (!(this.savePageToLoginRequiredService.returnPage.filteModel && this.savePageToLoginRequiredService.returnPage.filteModel.oldTo)) {
        //   this.filterModel.oldTo = Math.max(...res2);
        // }
        if (!res2 || (res2.length === 1 && res2[0] === 0)) {
          this.showFilterYear = false;
        } else {
          this.showFilterYear = true;
        }
        this.isShowRangeBar = true;
        this.someRange = [0,  (res2 || []).length !== 0 ? Math.max(...res2) : 0];
        this.maxRange = (res2 || []).length !== 0 ? Math.max(...res2) : 0;
        this.maxValue = this.maxRange;
        // Set value max khi login return page - login required
        if (this.isOldToReturnPageLogin) {
          this.maxValue = this.isOldToReturnPageLogin;
        }
        this.options.ceil = this.maxRange;
      });
    if (this.savePageToLoginRequiredService.returnPage.filteModel && this.savePageToLoginRequiredService.returnPage.filteModel.oldTo) {
      const temp = this.savePageToLoginRequiredService.returnPage.filteModel.oldTo;
      this.filterModel.oldTo = temp;
    }
    this.removeReturnPage();
    this.lookForInfoService.searchKeyWordForesttoSpeciesOrCommuneList(
      // tslint:disable-next-line:max-line-length
      this.searchTerm$, this.filterModel, this.pagedResult.currentPage ? this.pagedResult.currentPage : 0, this.pagedResult.pageSize ? this.pagedResult.pageSize : 10,
    ).subscribe(response => {
      this.render(response);
    });

    RecaptchaComponent.prototype.ngOnDestroy = function() {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
    };

    if (this.sessionService.currentSession) {
      if (this.sessionService.currentSession.role && this.sessionService.currentSession.role === 'Admin') {
        this.admin = true;
      } else {
        this.admin = false;
      }
    }
  }

  checkPageReturn() {
    if (Object.values(this.savePageToLoginRequiredService.returnPage).length !== 0) {
      if (this.savePageToLoginRequiredService.returnPage.filteModel) {
        this.filterModel = this.savePageToLoginRequiredService.returnPage.filteModel;
      }
      if (this.savePageToLoginRequiredService.returnPage.currentPage) {
        this.pagedResult.currentPage = this.savePageToLoginRequiredService.returnPage.currentPage;
      }
      if (this.savePageToLoginRequiredService.returnPage.pageSize) {
        this.pagedResult.pageSize = this.savePageToLoginRequiredService.returnPage.pageSize;
      }
      if (this.savePageToLoginRequiredService.returnPage.filteModel.oldFrom) {
        this.minValue = this.savePageToLoginRequiredService.returnPage.filteModel.oldFrom;
      }
      this.isOldToReturnPageLogin = this.savePageToLoginRequiredService.returnPage.filteModel.oldTo;
      if (this.savePageToLoginRequiredService.returnPage.searchTerm) {
        this.searchTerm$.next(this.savePageToLoginRequiredService.returnPage.searchTerm);
      }
    }
  }

  removeReturnPage() {
    this.savePageToLoginRequiredService.removeReturnPage();
  }

  render(pagedResult) {
    this.pagedResult = pagedResult;
    this.detailsofTreeSpecies = this.pagedResult.extraData;
    this.loading = false;
  }

  pagedResultChange(pagedResult) {
    this.loading = true;
    this.lookForInfoService.getForesttoSpeciesOrCommuneList(this.searchTerm$.value, this.filterModel, pagedResult.currentPage, pagedResult.pageSize)
      .subscribe(result => {
        this.render(result);
      });
  }

  filter() {
    this.loading = true;
    this.filterModel.oldFrom = this.minValue;
    this.filterModel.oldTo = this.maxValue;
    this.lookForInfoService.getForesttoSpeciesOrCommuneList(this.searchTerm$.value, this.filterModel, 0, 10)
      .subscribe(result => {
        this.render(result);
      });
  }
  changeValueRange(newValue) {
    this.filterModel.oldFrom = newValue[0];
    this.filterModel.oldTo = newValue[1];
  }

  clearFilter() {
    this.loading = true;
    this.filterModel.forestCertID = null;
    this.filterModel.treeSpecies = null;
    this.filterModel.oldFrom = 0;
    this.filterModel.oldTo = this.maxRange;
    this.filterModel.reliability = null;
    this.filterModel.sorting = 'GECompartmentCode Asc';
    this.someRange = [0, this.maxRange];
    this.minValue = 0;
    this.maxValue = this.maxRange;
    this.lookForInfoService.getForesttoSpeciesOrCommuneList(this.searchTerm$.value, this.filterModel, 0, 10)
      .subscribe(result => {
        this.render(result);
      });
  }

  showPopupDetailForestOwner(actor, actorType, forestPlotId) {
    if (this.sessionService.currentSession) {
      this.nbDialogService
        .open(ActorPopupComponent, {
          context: {
            actor: actor,
            actorType: actorType,
            forestPlotId: forestPlotId,
          },
        })
        .onClose.subscribe();
    } else {
      this.nbDialogService
        .open(LoginRequiredComponent, {
          context: {
            filterModel: this.filterModel,
            searchTerm: this.searchTerm$.value,
            currentPage: this.pagedResult.currentPage,
            pageSize: this.pagedResult.pageSize,
            routerBack: `/pages/infor-search/detail/${this.commune}/${this.filterModel.treeSpecID}`,
          },
        })
        .onClose.subscribe();
    }
  }

  routerBack() {
    this.router.navigate(['/pages/infor-search/list']);
  }

  showPopupDetailInformationIndirect(idContact: number, detailsofTreeSpecies) {
    if (this.sessionService.currentSession) {
      this.nbDialogService
        .open(InformationIndirectComponent, {
          context: {
            forestPlotId: idContact,
            detailsofTreeSpecies: detailsofTreeSpecies,
            communeId: this.commune,
          },
        })
        .onClose.subscribe();
    } else {
      this.nbDialogService
        .open(LoginRequiredComponent, {
          context: {
            filterModel: this.filterModel,
            searchTerm: this.searchTerm$.value,
            currentPage: this.pagedResult.currentPage,
            pageSize: this.pagedResult.pageSize,
            routerBack: `/pages/infor-search/detail/${this.commune}/${this.filterModel.treeSpecID}`,
          },
        })
        .onClose.subscribe();
    }
  }

  showDetailTreeSpecies(item: ForestSpecailOrCommune) {
    this.nbDialogService
      .open(TreeSpeciesComponent, {
        context: {
          ForestSpecailOrCommuneItem: item,
          detailsofTreeSpecies: this.detailsofTreeSpecies,

          filterModel: this.filterModel,
          searchTerm: this.searchTerm$.value,
          currentPage: this.pagedResult.currentPage,
          pageSize: this.pagedResult.pageSize,
          routerBack: `/pages/infor-search/detail/${this.commune}/${this.filterModel.treeSpecID}`,
        },
      })
      .onClose.subscribe();
  }

  showDetailCreateTreeSpecies(item: ForestSpecailOrCommune) {
    this.nbDialogService
      .open(CreateTreeSpeciesComponent, {
        context: {
          ForestSpecailOrCommuneItem: item,
          detailsofTreeSpecies: this.detailsofTreeSpecies,

          filterModel: this.filterModel,
          searchTerm: this.searchTerm$.value,
          currentPage: this.pagedResult.currentPage,
          pageSize: this.pagedResult.pageSize,
          routerBack: `/pages/infor-search/detail/${this.commune}/${this.filterModel.treeSpecID}`,
        },
      })
      .onClose.subscribe();
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
      this.filterModel.sorting = fieldName + this.orderBy;
    } else {
      this.filterModel.sorting = '';
    }
    this.filter();
  }

  customUIslider() {
    // heght
    // if (this.filterModel.oldTo) {
    const noUiTarget = document.querySelector('div.noUi-target.noUi-ltr.noUi-horizontal') as HTMLElement;
    const uiNoBase = document.querySelector('div.noUi-base') as HTMLElement;
    const uiNoConnect = document.querySelector('div.noUi-connects') as HTMLElement;
    noUiTarget.style.height = '6px';
    uiNoBase.style.height = '6px';
    uiNoConnect.style.height = '6px';
    const rightControl = document.querySelector('div.noUi-handle.noUi-handle-upper');
    rightControl.classList.add('noUi-handle');
    rightControl.setAttribute('style', 'width:15px; height:15px; border-radius:50%; right: -7px; top:-5px;');
    const leftControl = document.querySelector('div.noUi-handle.noUi-handle-lower');
    leftControl.setAttribute('style', 'width:15px; height:15px; border-radius:50%; right:-7px; top:-5px;');
    const nouislider = document.querySelector('nouislider.ng2-nouislider');
    nouislider.setAttribute('style', 'margin-top:0;margin-bottom:0;padding:0.5rem;');
    // }
  }

  openPopupGoogleMap(item) {
    const markerAddress = `Lô ${item.plotCode} | Khoảnh ${item.subCompartment && item.subCompartment.code ? item.subCompartment.code : ''} | Tiểu khu ${item.compartment && item.compartment.code ? item.compartment.code : ''}
    | ${this.detailsofTreeSpecies.commune && this.detailsofTreeSpecies.commune.text ? this.detailsofTreeSpecies.commune.text : ''} | ${this.detailsofTreeSpecies.district && this.detailsofTreeSpecies.district.text ? this.detailsofTreeSpecies.district.text : ''} | ${this.detailsofTreeSpecies.stateProvince && this.detailsofTreeSpecies.stateProvince.text ? this.detailsofTreeSpecies.stateProvince.text : ''}`;
    this.nbDialogService
      .open(GoogleMapComponent, {
        context: {
          locationLatitude: item.locationLatitude,
          locationLongitude: item.locationLongitude,
          markerAddress: markerAddress,
          markerLabel: `Lô ${item.plotCode}`,
        },
      })
      .onClose.subscribe();
  }


}
