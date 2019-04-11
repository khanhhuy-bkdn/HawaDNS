import { Component, OnInit, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { Router } from '@angular/router';
import { FilteForestSpecailOrCoomune } from '../../../model/filter-forest-specailOrCoomune.model';
import { LookForInfoService } from '../../../service/look-for-info.service';
import { SavePageToLoginRequiredService } from '../../../service/save-page-to-login-required.service';
import { ReturnPage } from '../../../model/return-page/return-page.model';

@Component({
  selector: 'login-required',
  templateUrl: './login-required.component.html',
  styleUrls: ['./login-required.component.scss']
})
export class LoginRequiredComponent implements OnInit {
  @Input() filterModel: FilteForestSpecailOrCoomune;
  @Input() searchTerm: string;
  @Input() currentPage: number;
  @Input() pageSize: number;
  @Input() routerBack: string;
  constructor(
    private dialogRef: NbDialogRef<LoginRequiredComponent>,
    private router: Router,
    private savePageToLoginRequiredService: SavePageToLoginRequiredService
  ) { }

  ngOnInit() {
    // const returnPage = new ReturnPage();
    // returnPage.routerBack = `10`;
    // console.log(Object.values(returnPage));
  }

  closePopup() {
    this.dialogRef.close();
  }

  returnPageLogin() {
    this.savePageToLoginRequiredService.returnPage.filteModel = this.filterModel ? this.filterModel : null ;
    this.savePageToLoginRequiredService.returnPage.searchTerm = this.searchTerm ? this.searchTerm : null;
    this.savePageToLoginRequiredService.returnPage.currentPage = this.currentPage ? this.currentPage : null;
    this.savePageToLoginRequiredService.returnPage.pageSize = this.pageSize ? this.pageSize : null;
    this.savePageToLoginRequiredService.returnPage.routerBack = this.routerBack ? this.routerBack : null;
    this.router.navigate(['/auth/sign-in/']);
  }

}
