export class PagedResult<T> {
    currentPage: number | string = 0;
    pageSize: number | string = 10;
    pageCount: number | string;
    total: number | string;
    items: T[];
}
