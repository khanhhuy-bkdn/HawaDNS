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
import { Router } from '@angular/router';
import { TreespecsList } from '../../../../shared/model/treespecs-list.model';
import { CreateForestPlot } from '../../../../shared/model/forest-plot/create-forest-plot.model';
import { EMPTY } from 'rxjs';
import { ActorService } from '../../../service/actor/actor.service';
import { ActorModel } from '../../../../shared/model/actor/actor.model';
import { TreeSpeciesService } from '../../../service/tree-species/tree-species.service';
import { AlertService } from '../../../../shared/service/alert.service';
import DateTimeConvertHelper from '../../../helpers/datetime-convert-helper';

@Component({
    selector: 'create-tree-species',
    templateUrl: './create-tree-species.component.html',
    styleUrls: ['./create-tree-species.component.scss'],
})
export class CreateTreeSpeciesComponent implements OnInit {
    @Input() ForestSpecailOrCommuneItem: ForestSpecailOrCommune;
    @Input() detailsofTreeSpecies: OverviewForest;
    // Input for return page filter Login required
    @Input() filterModel: FilteForestSpecailOrCoomune;
    @Input() searchTerm: string;
    @Input() currentPage: number;
    @Input() pageSize: number;
    @Input() routerBack: string;
    @Input() action: string;
    createSpecTreeForm: FormGroup;
    FormDetailSpecTree: FormGroup;
    landUseCerts: MasterData[];
    admin = false;
    listOfTreeSpec: TreespecsList[];
    listOfActor: ActorModel[];
    createTreeSpecModel: ForestSpecailOrCommune;
    treeSpecValue;
    actorValue;
    forestCerts: MasterData[];
    reliabilitys: MasterData[];
    dateValue: Date;
    constructor(
        private dialogRef: NbDialogRef<CreateTreeSpeciesComponent>,
        private dataGeneralService: DataGeneralService,
        private actorService: ActorService,
        private fb: FormBuilder,
        private nbDialogService: NbDialogService,
        private sessionService: SessionService,
        private router: Router,
        private treeSpeciesService: TreeSpeciesService,
        private alertService: AlertService,
    ) { }

    ngOnInit() {
        this.createTreeSpecModel = new ForestSpecailOrCommune();
        this.createTreeSpecModel = this.ForestSpecailOrCommuneItem;
        this.createForm();
        this.dataGeneralService.getMasterData.subscribe(response => {
            this.landUseCerts = response.landUseCerts;
            this.forestCerts = response.forestCerts;
            this.reliabilitys = response.forestplotReliability;
        });
        if (this.sessionService.currentSession) {
            if (this.sessionService.currentSession.role && this.sessionService.currentSession.role === 'Admin') {
                this.admin = true;
            } else {
                this.admin = false;
            }
        }
        this.getTreespecs();
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
            // tslint:disable-next-line:max-line-length
            reliability: this.ForestSpecailOrCommuneItem && this.ForestSpecailOrCommuneItem.reliability && this.ForestSpecailOrCommuneItem.reliability.key,
            plantingDate: (this.ForestSpecailOrCommuneItem && this.ForestSpecailOrCommuneItem.plantingDate) ? (new Date(this.ForestSpecailOrCommuneItem.plantingDate * 1000).toISOString()) : '',
        });
    }

    // editForm() {
    //   this.action = 'edit';
    //   // tslint:disable-next-line:max-line-length
    //   this.router.navigate([`pages/infor-search/detail/${this.detailsofTreeSpecies.commune.key}/${this.ForestSpecailOrCommuneItem.treeSpec.id}/edit/${this.ForestSpecailOrCommuneItem.id}`]);
    // }

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
                        routerBack: this.routerBack,
                    },
                })
                .onClose.subscribe();
        }

    }

    openPopupGoogleMap() {
        // tslint:disable-next-line:max-line-length
        let markerAddress = `Lô ${this.ForestSpecailOrCommuneItem.plotCode} | Khoảnh ${this.ForestSpecailOrCommuneItem.subCompartment && this.ForestSpecailOrCommuneItem.subCompartment.code ? this.ForestSpecailOrCommuneItem.subCompartment.code : ''} | Tiểu khu ${this.ForestSpecailOrCommuneItem.compartment && this.ForestSpecailOrCommuneItem.compartment.code ? this.ForestSpecailOrCommuneItem.compartment.code : ''}
    | ${this.detailsofTreeSpecies.commune && this.detailsofTreeSpecies.commune.text ? this.detailsofTreeSpecies.commune.text : ''} | ${this.detailsofTreeSpecies.district && this.detailsofTreeSpecies.district.text ? this.detailsofTreeSpecies.district.text : ''} | ${this.detailsofTreeSpecies.stateProvince && this.detailsofTreeSpecies.stateProvince.text ? this.detailsofTreeSpecies.stateProvince.text : ''}`;
        this.nbDialogService
            .open(GoogleMapComponent, {
                context: {
                    locationLatitude: this.ForestSpecailOrCommuneItem.locationLatitude,
                    locationLongitude: this.ForestSpecailOrCommuneItem.locationLongitude,
                    markerAddress: markerAddress,
                    markerLabel: `Lô ${this.ForestSpecailOrCommuneItem.plotCode}`,
                },
            })
            .onClose.subscribe();
    }

    getTreespecs() {
        this.dataGeneralService.getTreespecsAll().subscribe(result => {
            this.listOfTreeSpec = result;
            this.treeSpecValue = this.listOfTreeSpec.find(item => item.id === this.createTreeSpecModel.treeSpec.id);
            this.FormDetailSpecTree.get('treeSpecName').patchValue(this.treeSpecValue.id);
        });

        setTimeout(() => {
            this.actorService.getAllActor().subscribe(result => {
                this.listOfActor = result;
                this.actorValue = this.listOfActor.find(item => item.id === this.createTreeSpecModel.actor.id);
                this.FormDetailSpecTree.get('actor').patchValue(this.actorValue.id);
                this.FormDetailSpecTree.get('actorType').patchValue(this.actorValue.type.name);
            });
        }, 100);

        this.FormDetailSpecTree.get('conflictSitCode').patchValue(this.createTreeSpecModel.conflictSitCode);

        const forestCertValue = this.forestCerts.find(item => item.key === this.createTreeSpecModel.forestCert.key);
        this.FormDetailSpecTree.get('forestCert').patchValue(forestCertValue.key);

        const landUseCertValue = this.landUseCerts.find(item => item.key === this.createTreeSpecModel.landUseCert.key);
        this.FormDetailSpecTree.get('landUseCert').patchValue(landUseCertValue.key);

        const reliabilityValue = this.reliabilitys.find(item => item.key === this.createTreeSpecModel.reliability.key);
        this.FormDetailSpecTree.get('reliability').patchValue(reliabilityValue.key);

        this.dateValue = new Date(this.FormDetailSpecTree.get('plantingDate').value);
        console.log(this.dateValue)
    }

    getActorType(actor) {
        if (actor === 'null') {
            this.FormDetailSpecTree.get('actorType').patchValue(null);
        } else {
            const value = this.listOfActor.find(item => item.id == actor);
            this.FormDetailSpecTree.get('actorType').patchValue(value.type.name);
        }
    }

    submitForm() {
        this.treeSpeciesService.editTreeSpecies(this.ForestSpecailOrCommuneItem.id, this.FormDetailSpecTree.value).subscribe(result => {
            this.alertService.success('Cập nhật thông tin thành công');
            this.sessionService.userSubject.next(result);
            // tslint:disable-next-line:max-line-length
            //this.router.navigate([`pages/infor-search/detail/${this.detailsofTreeSpecies.commune.key}/${this.ForestSpecailOrCommuneItem.treeSpec.id}`]);
            this.closePopup();
        }, err => this.alertService.error('Cập nhật thông tin không thành công.'));
    }
}
