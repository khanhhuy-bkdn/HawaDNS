import { Component, OnInit, OnDestroy } from '@angular/core';
import { ContactListsIndirectlyAdminService } from '../../../../shared/service/contact-lists-indirectly-admin.service';

@Component({
  selector: 'contribute',
  templateUrl: './contribute.component.html',
  styleUrls: ['./contribute.component.scss']
})
export class ContributeComponent implements OnInit, OnDestroy{

  constructor(
    private contactListsIndirectlyAdminService: ContactListsIndirectlyAdminService,
  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.contactListsIndirectlyAdminService.filterList = null;
  }

}
