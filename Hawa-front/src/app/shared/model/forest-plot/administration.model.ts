import { OverviewForest } from "../overview-forest.model";

export class Administration<T> {
    extraData: OverviewForest;
    currentPage: number | string = 0;
    pageSize: number | string = 10;
    pageCount: number | string;
    total: number | string;
    items: T[];
}