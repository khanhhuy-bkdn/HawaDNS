import { Dictionary } from "./dictionary/dictionary.model";
import { TreeSpecies } from "./dictionary/tree-species.model";
import { TreeSpecGroup } from "./setting/tree-spec-group/tree-spec-group.model";

export class FilterOVerviewForest {
    stateProvinceID: Dictionary;
    districtID: Dictionary;
    communeID: Dictionary;
    treeSpecID: TreeSpecies;
    treeSpecGroupID: TreeSpecGroup;
    sorting: string;
}
