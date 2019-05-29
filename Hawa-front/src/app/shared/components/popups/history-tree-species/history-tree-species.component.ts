import { Component, OnInit, Input } from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { DataGeneralService } from '../../../service/data-general.service';
import { MasterData } from '../../../model/dictionary/master-data.model';
import { ForestSpecailOrCommune } from '../../../model/forest-specailOrCommune.model';
import { OverviewForest } from '../../../model/overview-forest.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SessionService } from '../../../service/session.service';
import { Router } from '@angular/router';
import { TreespecsList } from '../../../../shared/model/treespecs-list.model';
import { EMPTY, BehaviorSubject } from 'rxjs';
import { ActorService } from '../../../service/actor/actor.service';
import { ActorModel } from '../../../../shared/model/actor/actor.model';
import { TreeSpeciesService } from '../../../service/tree-species/tree-species.service';
import { AlertService } from '../../../../shared/service/alert.service';
import DateTimeConvertHelper from '../../../helpers/datetime-convert-helper';
import { Administration } from '../../../model/forest-plot/administration.model';
import { HistoryForestSpecailOrCommune } from '../../../model/history-forest-specailOrCommune.model';
import { FilteHistoryForestSpecailOrCoomune } from '../../../model/filter-history-forest-specailOrCoomune.model';

@Component({
    selector: 'history-tree-species',
    templateUrl: './history-tree-species.component.html',
    styleUrls: ['./history-tree-species.component.scss'],
})
// tslint:disable-next-line:component-class-suffix
export class HistoryTreeSpecies implements OnInit {
    @Input() ForestSpecailOrCommuneItem: ForestSpecailOrCommune;
    @Input() detailsofTreeSpecies: OverviewForest;
    // Input for return page filter Login required
    pagedResult: Administration<HistoryForestSpecailOrCommune> = new Administration<HistoryForestSpecailOrCommune>();
    searchTerm$ = new BehaviorSubject<string>('');
    filterModel = new FilteHistoryForestSpecailOrCoomune();
    routerBack: string;
    FormDetailSpecTree: FormGroup;
    landUseCerts: MasterData[];
    admin = false;
    loading = false;
    currentSort = '';
    orderBy = '';
    listOfTreeSpec: TreespecsList[];
    listOfActor: ActorModel[];
    createTreeSpecModel: ForestSpecailOrCommune;
    treeSpecValue;
    actorValue;
    forestCerts: MasterData[];
    reliabilitys: MasterData[];
    dateValue: Date;
    constructor(
        private dialogRef: NbDialogRef<HistoryTreeSpecies>,
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
        this.loading = true;
        this.filterModel.communeID = null;
        this.filterModel.forestCertID = this.createTreeSpecModel.forestCert.key;
        this.filterModel.forestPlotID = this.createTreeSpecModel.id;
        // tslint:disable-next-line:max-line-length
        this.treeSpeciesService.GetHistoryForesttoSpeciesOrCommuneList(this.filterModel, this.treeSpeciesService.currentPage ? this.treeSpeciesService.currentPage : 0, this.treeSpeciesService.pageSize ? this.treeSpeciesService.pageSize : 10).subscribe(data => {
            this.render(data);
        });
    }

    render(pagedResult) {
        this.pagedResult = pagedResult;
        this.loading = false;
    }

    pagedResultChange(pagedResult) {
        this.loading = true;
        this.treeSpeciesService.GetHistoryForesttoSpeciesOrCommuneList(this.filterModel, pagedResult.currentPage, pagedResult.pageSize)
            .subscribe(result => {
                this.render(result);
            });
    }

    viewDetailForest(item: HistoryForestSpecailOrCommune) {
        this.treeSpeciesService.detailsofTreeSpecies = item;
        this.treeSpeciesService.filterList = this.filterModel;
        this.treeSpeciesService.currentPage = this.pagedResult.currentPage;
        this.treeSpeciesService.pageSize = this.pagedResult.pageSize;
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

    filter() {
        this.loading = true;
        this.treeSpeciesService.GetHistoryForesttoSpeciesOrCommuneList(this.filterModel, 0, 10)
            .subscribe(result => {
                this.render(result);
            });
    }
}
