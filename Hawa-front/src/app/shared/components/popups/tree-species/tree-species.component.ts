import { Component, OnInit, Input } from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { DataGeneralService } from '../../../service/data-general.service';
import { MasterData } from '../../../model/dictionary/master-data.model';
import { ForestSpecailOrCommune } from '../../../model/forest-specailOrCommune.model';
import { OverviewForest } from '../../../model/overview-forest.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActorPopupComponent } from '../actor-popup/actor-popup.component';
import { SessionService } from '../../../service/session.service';
import { LoginRequiredComponent } from '../login-required/login-required.component';
import { FilteForestSpecailOrCoomune } from '../../../model/filter-forest-specailOrCoomune.model';
import { GoogleMapComponent } from '../google-map/google-map.component';
import { CreateTreeSpeciesComponent } from '../create-tree-species/create-tree-species.component';
import { Router } from '@angular/router';

@Component({
  selector: 'tree-species',
  templateUrl: './tree-species.component.html',
  styleUrls: ['./tree-species.component.scss']
})
export class TreeSpeciesComponent implements OnInit {
  @Input() ForestSpecailOrCommuneItem: ForestSpecailOrCommune;
  @Input() detailsofTreeSpecies: OverviewForest;
  // Input for return page filter Login required
  @Input() filterModel: FilteForestSpecailOrCoomune;
  @Input() searchTerm: string;
  @Input() currentPage: number;
  @Input() pageSize: number;
  @Input() routerBack: string;
  @Input() action: string;
  FormDetailSpecTree: FormGroup;
  landUseCerts: MasterData[];
  admin = false;
  constructor(
    private dialogRef: NbDialogRef<TreeSpeciesComponent>,
    private dataGeneralService: DataGeneralService,
    private fb: FormBuilder,
    private nbDialogService: NbDialogService,
    private sessionService: SessionService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.createForm();
    this.dataGeneralService.getMasterData.subscribe(response => {
      this.landUseCerts = response.landUseCerts;
    });
    if (this.sessionService.currentSession) {
      if (this.sessionService.currentSession.role && this.sessionService.currentSession.role === 'Admin') {
        this.admin = true;
      } else {
        this.admin = false;
      }
    }
  }

  createForm() {
    this.FormDetailSpecTree = this.fb.group({
      // tslint:disable-next-line:max-line-length
      treeSpecName: this.ForestSpecailOrCommuneItem && this.ForestSpecailOrCommuneItem.treeSpec && this.ForestSpecailOrCommuneItem.treeSpec.name,
      plantingYear: this.ForestSpecailOrCommuneItem && this.ForestSpecailOrCommuneItem.plantingYear,
      // tslint:disable-next-line:max-line-length
      volumnPerPlot: (this.ForestSpecailOrCommuneItem && this.ForestSpecailOrCommuneItem.volumnPerPlot) ? this.ForestSpecailOrCommuneItem.volumnPerPlot : null,
      forestCert: this.ForestSpecailOrCommuneItem && this.ForestSpecailOrCommuneItem.forestCert && this.ForestSpecailOrCommuneItem.forestCert.text,
      area: (this.ForestSpecailOrCommuneItem && this.ForestSpecailOrCommuneItem.area) ? this.ForestSpecailOrCommuneItem.area : null,
      // tslint:disable-next-line:max-line-length
      conflictSitCode: (this.ForestSpecailOrCommuneItem && this.ForestSpecailOrCommuneItem.conflictSitCode && this.ForestSpecailOrCommuneItem.conflictSitCode === 1) ? 'Có tranh chấp' : 'Không tranh chấp',
      actor: this.ForestSpecailOrCommuneItem && this.ForestSpecailOrCommuneItem.actor && this.ForestSpecailOrCommuneItem.actor.name,
      // tslint:disable-next-line:max-line-length
      landUseCert: this.ForestSpecailOrCommuneItem && this.ForestSpecailOrCommuneItem.landUseCert && this.ForestSpecailOrCommuneItem.landUseCert.text,
      actorType: this.ForestSpecailOrCommuneItem && this.ForestSpecailOrCommuneItem.actorType && this.ForestSpecailOrCommuneItem.actorType.name,
    });
  }

  editForm() {
    this.action = 'edit';
    this.dialogRef.close();
    this.showDetailTreeSpecies(this.ForestSpecailOrCommuneItem, this.detailsofTreeSpecies);
    // tslint:disable-next-line:max-line-length
    // this.router.navigate([`pages/infor-search/detail/${this.detailsofTreeSpecies.commune.key}/${this.ForestSpecailOrCommuneItem.treeSpec.id}/edit/${this.ForestSpecailOrCommuneItem.id}`]);
  }

  showDetailTreeSpecies(item: ForestSpecailOrCommune, details: OverviewForest) {
    this.nbDialogService
      .open(CreateTreeSpeciesComponent, {
        context: {
          ForestSpecailOrCommuneItem: item,
          detailsofTreeSpecies: details,

          filterModel: this.filterModel,
          searchTerm: this.searchTerm,
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          routerBack: `/pages/infor-search/detail/${this.detailsofTreeSpecies.commune.key}/${this.ForestSpecailOrCommuneItem.treeSpec.id}`,
        },
      })
      .onClose.subscribe();
  }

  closePopup() {
    this.dialogRef.close();
  }

  getLandUseCertsList() {
    if (this.landUseCerts) {
      return `Loại 1: ${this.landUseCerts[0].text}
Loại 2: ${this.landUseCerts[1].text}
Loại 3: ${this.landUseCerts[2].text}
Loại 4: ${this.landUseCerts[3].text}`;
    } else {
      return null;
    }
  }

  showPopupDetailForestOwner() {
    if (this.sessionService.currentSession) {
      this.nbDialogService
        .open(ActorPopupComponent, {
          context: {
            actor: this.ForestSpecailOrCommuneItem.actor,
            actorType: this.ForestSpecailOrCommuneItem.actorType.name,
            forestPlotId: this.ForestSpecailOrCommuneItem.id,
          }
        })
        .onClose.subscribe();
    } else {
      this.nbDialogService
        .open(LoginRequiredComponent, {
          context: {
            filterModel: this.filterModel,
            searchTerm: this.searchTerm,
            currentPage: this.currentPage,
            pageSize: this.pageSize,
            routerBack: this.routerBack
          }
        })
        .onClose.subscribe();
    }

  }

  openPopupGoogleMap() {
    let markerAddress = `Lô ${this.ForestSpecailOrCommuneItem.plotCode} | Khoảnh ${this.ForestSpecailOrCommuneItem.subCompartment && this.ForestSpecailOrCommuneItem.subCompartment.code ? this.ForestSpecailOrCommuneItem.subCompartment.code : ''} | Tiểu khu ${this.ForestSpecailOrCommuneItem.compartment && this.ForestSpecailOrCommuneItem.compartment.code ? this.ForestSpecailOrCommuneItem.compartment.code : ''}
    | ${this.detailsofTreeSpecies.commune && this.detailsofTreeSpecies.commune.text ? this.detailsofTreeSpecies.commune.text : ''} | ${this.detailsofTreeSpecies.district && this.detailsofTreeSpecies.district.text ? this.detailsofTreeSpecies.district.text : ''} | ${this.detailsofTreeSpecies.stateProvince && this.detailsofTreeSpecies.stateProvince.text ? this.detailsofTreeSpecies.stateProvince.text : ''}`;
    this.nbDialogService
      .open(GoogleMapComponent, {
        context: {
          locationLatitude: this.ForestSpecailOrCommuneItem.locationLatitude,
          locationLongitude: this.ForestSpecailOrCommuneItem.locationLongitude,
          markerAddress: markerAddress,
          markerLabel: `Lô ${this.ForestSpecailOrCommuneItem.plotCode}`
        }
      })
      .onClose.subscribe();
  }

}
