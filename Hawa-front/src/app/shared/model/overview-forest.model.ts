export class OverviewForest {
    // id: number;
    stateProvince: {
        key: string;
        code: string;
        text: string;
    };
    district: {
        key: string;
        code: string;
        text: string;
    };
    commune: {
        key: string;
        code: string;
        text: string;
    };
    treeSpec: {
        id: number;
        name: string;
        acronym: string;
        latin: string;
        geoDistribution: string;
        isSpecialProduct: boolean;
    };
    volumnPerPlot: number;
    area: number;
    locationLatitudeCommune: number;
    locationLongitudeCommune: number;
}