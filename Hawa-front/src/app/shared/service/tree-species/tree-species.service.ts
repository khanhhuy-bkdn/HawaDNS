import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { PagedResult } from '../../model/dictionary/paging-result.model';
import { FilteHistoryForestSpecailOrCoomune } from '../../model/filter-history-forest-specailOrCoomune.model';
import { HistoryForestSpecailOrCommune } from '../../model/history-forest-specailOrCommune.model';
import { ApiService } from './../api.service';


@Injectable({
    providedIn: 'root',
})
export class TreeSpeciesService {
    private localStorage = window.localStorage;
    detailsofTreeSpecies: HistoryForestSpecailOrCommune;
    filterList = null;
    currentPage = null;
    pageSize = null;
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

    GetHistoryForesttoSpeciesOrCommuneList(
        filter: FilteHistoryForestSpecailOrCoomune,
        page: number | string,
        pageSize: number | string,
    ): Observable<PagedResult<HistoryForestSpecailOrCommune>> {
        const filterUrl = `forestplot/detail/history/filter/${page}/${pageSize}`;
        const urlParams = this.createFilterParamsHistoryForesttoSpeciesList(filter);
        return this.apiService.get(filterUrl, urlParams).map(response => {
            const result = response.result;
            return {
                currentPage: result.pageIndex,
                pageSize: result.pageSize,
                pageCount: result.totalPages,
                total: result.totalCount,
                items: (result.items || []).map(this.mappingHistoryForesttoSpeciesOrCommuneList),
            };
        });
    }

    // Create param url cho Danh sách thông tin về rừng theo loại cây của từng xã(lọc và sorting)
    createFilterParamsHistoryForesttoSpeciesList(filterModel: FilteHistoryForestSpecailOrCoomune): URLSearchParams {
        const urlFilterParams = new URLSearchParams();
        urlFilterParams.append(
            'communeID',
            filterModel.communeID ? filterModel.communeID.toString() : '',
        );
        urlFilterParams.append(
            'treeSpecID',
            (filterModel.treeSpecID && (+filterModel.treeSpecID !== 0)) ? filterModel.treeSpecID.toString() : '',
        );
        urlFilterParams.append(
            'forestCertID',
            (filterModel.forestCertID && filterModel.forestCertID !== 'null') ? filterModel.forestCertID.toString() : '',
        );
        urlFilterParams.append(
            'treeSpecGroupID',
            filterModel.treeSpecGroupID ? filterModel.treeSpecGroupID.toString() : '',
        );
        urlFilterParams.append(
            'reliability',
            (filterModel.reliability && filterModel.reliability !== 'null') ? filterModel.reliability.toString() : '',
        );
        urlFilterParams.append(
            'forestPlotID',
            (filterModel.forestPlotID && filterModel.forestPlotID !== 0) ? filterModel.forestPlotID.toString() : '',
        );
        urlFilterParams.append(
            'sorting',
            filterModel.sorting ? filterModel.sorting.toString() : '',
        );
        return urlFilterParams;
    }

    // Mapping to model cho Danh sách thông tin về rừng theo loại cây của từng xã(lọc và sorting)
    mappingHistoryForesttoSpeciesOrCommuneList(result: any): HistoryForestSpecailOrCommune {
        return {
            id: result.id,
            treeSpec: result.treeSpec ? {
                id: result.treeSpec.id,
                name: result.treeSpec.name,
                acronym: result.treeSpec.acronym,
                latin: result.treeSpec.latin,
                geoDistribution: result.treeSpec.geoDistribution,
                isSpecialProduct: result.treeSpec.isSpecialProduct,
            } : null,
            compartment: result.compartment ? {
                key: result.compartment.key,
                code: result.compartment.code,
                text: result.compartment.text,
            } : null,
            compartmentCode: result.compartmentCode,
            subCompartment: result.subCompartment ? {
                key: result.subCompartment.key,
                code: result.subCompartment.code,
                text: result.subCompartment.text,
            } : null,
            subCompartmentCode: result.subCompartmentCode,
            plot: result.plot ? {
                key: result.plot.key,
                code: result.plot.code,
                text: result.plot.text,
            } : null,
            plotCode: result.plotCode,
            volumnPerPlot: result.volumnPerPlot,
            area: result.area,
            plantingYear: result.plantingYear,
            dispute: result.dispute ? {
                key: result.dispute.key,
                code: result.dispute.code,
                text: result.dispute.text,
            } : null,
            actor: result.actor ? {
                id: result.actor.id,
                name: result.actor.name,
                email: result.actor.email,
                phone: result.actor.phone,
                website: result.actor.website,
                avatar: result.avatar ? {
                    guid: result.avatar.guid,
                    thumbSizeUrl: result.avatar.thumbSizeUrl,
                    largeSizeUrl: result.avatar.largeSizeUrl,
                } : null,
            } : null,
            actorType: result.actorType ? {
                id: result.actorType.id,
                name: result.actorType.name,
                code: result.actorType.code,
                acronymName: result.actorType.acronymName,
            } : null,
            forestCert: result.forestCert ? {
                key: result.forestCert.key,
                code: result.forestCert.code,
                text: result.forestCert.text,
            } : null,
            reliability: result.reliability ? {
                key: result.reliability.key,
                code: result.reliability.code,
                text: result.reliability.text,
            } : null,
            landUseCert: result.landUseCert ? {
                key: result.landUseCert.key,
                code: result.landUseCert.code,
                text: result.landUseCert.text,
            } : null,
            conflictSitCode: result.conflictSitCode,
            locationLatitude: result.locationLatitude,
            locationLongitude: result.locationLongitude,
            plantingDate: result.plantingDate,
            user: result.user ? {
                id: result.user.id,
                email: result.user.email,
                userName: result.user.userName,
                organizationName: result.user.organizationName,
            } : null,
            createDate: result.createDate,
        };
    }
}
