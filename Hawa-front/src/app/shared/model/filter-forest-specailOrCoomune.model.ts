import { Dictionary } from "./dictionary/dictionary.model";
import { TreespecsList } from "./treespecs-list.model";

export class FilteForestSpecailOrCoomune {
    communeID: Dictionary;
    treeSpecID: TreespecsList;
    // forestCertID: Dictionary;
    forestCertID: string;
    treeSpecies: any;
    oldFrom: number;
    oldTo: number;
    treeSpecGroupID: number;
    // reliability: Dictionary;
    reliability: string;
    sorting: string;
}