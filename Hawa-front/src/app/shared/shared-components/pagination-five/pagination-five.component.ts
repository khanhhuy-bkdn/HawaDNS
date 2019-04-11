import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { PagedResult } from '../../model/dictionary/paging-result.model';
import { Page } from '../../model/pages.model';

@Component({
  selector: 'pagination-five',
  templateUrl: './pagination-five.component.html',
  styleUrls: ['./pagination-five.component.scss']
})
export class PaginationFiveComponent implements OnInit {

  @Input() pagedResult: PagedResult<any>;
  @Output() pagedResultChange = new EventEmitter<any>();

  maxSize = 7;
  pages: Page[];

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.pages = this.createPageArray(+this.pagedResult.currentPage + 1, +this.pagedResult.pageSize, +this.pagedResult.total, this.maxSize);
  }

  getPage(page: number | string): void {
    this.pagedResult.currentPage = page;
    this.pagedResultChange.emit(this.pagedResult);
  }

  getCurrentPage() {
    this.getPage(this.pagedResult.currentPage);
  }

  onItemsPerPageChange(pageSize: number | string) {
    this.pagedResult.pageSize = pageSize;
    this.pagedResult.currentPage = 0;
    this.pagedResultChange.emit(this.pagedResult);
  }

  private createPageArray(currentPage: number, itemsPerPage: number, totalItems: number, paginationRange: number): Page[] {
    // paginationRange could be a string if passed from attribute, so cast to number.
    paginationRange = +paginationRange;
    const pages = [];
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const halfWay = Math.ceil(paginationRange / 2);

    const isStart = currentPage <= halfWay;
    const isEnd = totalPages - halfWay < currentPage;
    const isMiddle = !isStart && !isEnd;

    const ellipsesNeeded = paginationRange < totalPages;
    let i = 1;

    while (i <= totalPages && i <= paginationRange) {
      let label;
      const pageNumber = this.calculatePageNumber(i, currentPage, paginationRange, totalPages);
      const openingEllipsesNeeded = (i === 2 && (isMiddle || isEnd));
      const closingEllipsesNeeded = (i === paginationRange - 1 && (isMiddle || isStart));
      if (ellipsesNeeded && (openingEllipsesNeeded || closingEllipsesNeeded)) {
        label = '...';
      } else {
        label = pageNumber;
      }
      pages.push({
        label: label,
        value: pageNumber
      });
      i++;
    }
    return pages;
  }

  /**
     * Given the position in the sequence of pagination links [i],
     * figure out what page number corresponds to that position.
     */
  private calculatePageNumber(i: number, currentPage: number, paginationRange: number, totalPages: number) {
    const halfWay = Math.ceil(paginationRange / 2);
    if (i === paginationRange) {
      return totalPages;
    } else if (i === 1) {
      return i;
    } else if (paginationRange < totalPages) {
      if (totalPages - halfWay < currentPage) {
        return totalPages - paginationRange + i;
      } else if (halfWay < currentPage) {
        return currentPage - halfWay + i;
      } else {
        return i;
      }
    } else {
      return i;
    }
  }
}
