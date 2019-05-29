import { Dictionary } from "./dictionary/dictionary.model";
import { TreespecsList } from "./treespecs-list.model";

export class FilteHistoryForestSpecailOrCoomune {
    communeID: Dictionary;
    treeSpecID: TreespecsList;
    forestCertID: string;
    treeSpecies: any;
    treeSpecGroupID: number;
    reliability: string;
    sorting: string;
    forestPlotID: number;
}