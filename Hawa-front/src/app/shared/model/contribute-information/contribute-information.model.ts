export class ContributeInformation {
    stateProvince: {
        key: string,
        code: string,
        text: string
    };
    district: {
        key: string,
        code: string,
        text: string
    };
    commune: {
        key: string,
        code: string,
        text: string
    };
    subdivision: number;
    sector: number;
    plots: number;
    contributesum: number;
    notapprove: number;
    verificating: number;
}