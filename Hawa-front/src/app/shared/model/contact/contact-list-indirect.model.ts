import { Dictionary } from '../dictionary/dictionary.model';

export class ContacListIndirect {
    forestPlotId: number;
    stateProvince: Dictionary;
    district: Dictionary;
    commune: Dictionary;
    compartment: Dictionary;
    subCompartment: Dictionary;
    plotCode: string;
    reviewCount: number;
    notConfirmStatusCount: number;
    pendingStatusCount: number
}