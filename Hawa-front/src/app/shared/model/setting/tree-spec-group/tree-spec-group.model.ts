export class TreeSpecGroup {
    id: number;
    name: string;
    desc: string;
    createdDate: number;
    treeSpecs: TreeSpec[];
    checked: boolean
}

export class TreeSpec {
    id: number;
    name: string;
    acronym: string;
    latin: string;
    geoDistribution: string;
    isSpecialProduct: boolean;
    checked: boolean
};
