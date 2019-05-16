import { Component, OnInit, OnDestroy } from '@angular/core';
import { ManageEvaluateService } from '../../../shared/service/manage-user-account/manage-evaluate.service';

@Component({
  selector: 'evaluate-actor',
  templateUrl: './evaluate-actor.component.html',
  styleUrls: ['./evaluate-actor.component.scss']
})
export class EvaluateActorComponent implements OnInit, OnDestroy {

  constructor(
    private manageEvaluateService: ManageEvaluateService, 
  ) { }

  ngOnInit() {
  }
  ngOnDestroy() {
    this.manageEvaluateService.filterModelListActor = null;
    this.manageEvaluateService.currentPageActor = null;
    this.manageEvaluateService.pageSizeActor = null;
    this.manageEvaluateService.searchTermActor = null;
  }
  
}
