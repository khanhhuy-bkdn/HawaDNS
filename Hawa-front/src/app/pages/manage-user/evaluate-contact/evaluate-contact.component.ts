import { Component, OnInit, OnDestroy } from '@angular/core';
import { ManageEvaluateService } from '../../../shared/service/manage-user-account/manage-evaluate.service';

@Component({
  selector: 'evaluate-contact',
  templateUrl: './evaluate-contact.component.html',
  styleUrls: ['./evaluate-contact.component.scss']
})
export class EvaluateContactComponent implements OnInit, OnDestroy {

  constructor(
    private manageEvaluateService: ManageEvaluateService,
  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.manageEvaluateService.filterModelListContact = null;
    this.manageEvaluateService.currentPageContact = null;
    this.manageEvaluateService.pageSizeContact = null;
  }

}
