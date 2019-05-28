import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { ApiService } from './../api.service';

@Injectable({
    providedIn: 'root'
})
export class TreeSpeciesService {
    private localStorage = window.localStorage;
    constructor(
        private apiService: ApiService,
    ) { }

    editTreeSpecies(id, model): Observable<any> {
        const url = `forestplot/detail/edit`;
        const info = {
            Id: id,
            ICConflictSitCode: model.conflictSitCode,
            ICForestPlotReliability: model.reliability,
            FK_APActorID: model.actor,
            FK_ICTreeSpecID: model.treeSpecName,
            FK_ICLandUseCertID: model.landUseCert,
            FK_ICForestCertID: model.forestCert,
            ICForestPlotArea: model.area,
            ICForestPlotVolumnPerPlot: model.volumnPerPlot,
            ICForestPlotPlantingDate: model.plantingDate,
            ICForestPlotPlantingYear: 0,
        };
        return this.apiService
            .post(url, info)
            .map(response => response.result);
    }
}
