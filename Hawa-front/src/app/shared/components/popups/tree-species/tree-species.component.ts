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
  FormDetailSpecTree: FormGroup;
  landUseCerts: MasterData[];
  constructor(
    private dialogRef: NbDialogRef<TreeSpeciesComponent>,
    private dataGeneralService: DataGeneralService,
    private fb: FormBuilder,
    private nbDialogService: NbDialogService,
    private sessionService: SessionService
  ) { }

  ngOnInit() {
    this.createForm();
    this.dataGeneralService.getMasterData.subscribe(response => {
      this.landUseCerts = response.landUseCerts;
    })
  }

  createForm() {
    this.FormDetailSpecTree = this.fb.group({
      treeSpecName: this.ForestSpecailOrCommuneItem && this.ForestSpecailOrCommuneItem.treeSpec && this.ForestSpecailOrCommuneItem.treeSpec.name,
      plantingYear: this.ForestSpecailOrCommuneItem && this.ForestSpecailOrCommuneItem.plantingYear,
      volumnPerPlot: (this.ForestSpecailOrCommuneItem && this.ForestSpecailOrCommuneItem.volumnPerPlot) ? this.ForestSpecailOrCommuneItem.volumnPerPlot : null,
      forestCert: this.ForestSpecailOrCommuneItem && this.ForestSpecailOrCommuneItem.forestCert && this.ForestSpecailOrCommuneItem.forestCert.text,
      area: (this.ForestSpecailOrCommuneItem && this.ForestSpecailOrCommuneItem.area) ? this.ForestSpecailOrCommuneItem.area : null,
      conflictSitCode: (this.ForestSpecailOrCommuneItem && this.ForestSpecailOrCommuneItem.conflictSitCode && this.ForestSpecailOrCommuneItem.conflictSitCode === 1) ? 'Có tranh chấp' : 'Không tranh chấp',
      actor: this.ForestSpecailOrCommuneItem && this.ForestSpecailOrCommuneItem.actor && this.ForestSpecailOrCommuneItem.actor.name,
      landUseCert: this.ForestSpecailOrCommuneItem && this.ForestSpecailOrCommuneItem.landUseCert && this.ForestSpecailOrCommuneItem.landUseCert.text,
      actorType: this.ForestSpecailOrCommuneItem && this.ForestSpecailOrCommuneItem.actorType && this.ForestSpecailOrCommuneItem.actorType.name,
    });
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
