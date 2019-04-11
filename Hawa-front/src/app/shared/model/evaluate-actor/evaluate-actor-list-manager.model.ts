import { Dictionary } from "../dictionary/dictionary.model";
import { TreeSpec } from "../setting/tree-spec-group/tree-spec-group.model";

export class EvaluateActorListManager {
    name: string;
    forestPlot: {
        id: number;
        stateProvince: Dictionary;
        district: Dictionary;
        commune: Dictionary;
        treeSpec: TreeSpec;
        volumnPerPlot: number;
        area: number;
        compartment: Dictionary;
        subCompartment: Dictionary;
        plotCode: string;
    }
    reviewCount: number;
    averageRating: number;
}