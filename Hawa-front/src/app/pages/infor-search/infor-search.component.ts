import { Component, OnInit, OnDestroy } from '@angular/core';
import { SessionService } from '../../shared/service/session.service';
import { Router } from '@angular/router';
import { LookForInfoService } from '../../shared/service/look-for-info.service';
@Component({
  selector: 'app-infor-search',
  templateUrl: './infor-search.component.html',
  styleUrls: ['./infor-search.component.scss']
})
export class InforSearchComponent implements OnInit, OnDestroy {
  constructor(
    private sessionService: SessionService,
    private router: Router,
    private lookForInfoService: LookForInfoService
  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.lookForInfoService.filterList = null;
    this.lookForInfoService.currentPage = null;
    this.lookForInfoService.pageSize = null;
  }

}
