export class PagedExtraResult<T, E> {
    extraData: E;
    currentPage: number | string = 0;
    pageSize: number | string = 10;
    pageCount: number | string;
    total: number | string;
    items: T[];
}
