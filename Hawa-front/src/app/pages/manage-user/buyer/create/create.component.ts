import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataGeneralService } from '../../../../shared/service/data-general.service';
import { ItemUnit } from '../../../../shared/model/dictionary/item-unit.model';
import { Router } from '@angular/router';
import { ManageBuyerService } from '../../../../shared/service/manage-user-account/manage-buyer.service';
import { NbDialogService } from '@nebular/theme';
import { PopupComponent } from '../../../../shared/components/popups/popup/popup.component';

@Component({
  selector: 'create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit, OnDestroy {
  typeUser = 'Personal';
  action = 'create';
  userTypes: ItemUnit[];
  masterData: any;
  constructor(
    private router: Router,
    private manageBuyerService: ManageBuyerService,
    private dialogService: NbDialogService,
  ) { }

  ngOnInit() {
    this.checkedTypeUser();
  }
  redirectBack() {
    this.router.navigate(['/pages/buyer']);
    this.manageBuyerService.directToBuyer(true);
  }

  toggleTypeOfUser(typeUser) {
    delete this.manageBuyerService.valueFormCreateBuyer.typeuser;
    delete this.manageBuyerService.valueFormCreateBuyer.status;
    if (this.manageBuyerService.valueFormCreateBuyer.province && this.manageBuyerService.valueFormCreateBuyer.province === 'null') {
      this.manageBuyerService.valueFormCreateBuyer.province = null;
    }
    const isValueForm = (Object.values(this.manageBuyerService.valueFormCreateBuyer) || []).every(item => {
      if (!item) {
        return true;
      } else {
        return false;
      }
    });
    if (!isValueForm) {
      this.dialogService
        .open(PopupComponent, {
          context: {
            showModel: {
              title: 'thay đổi loại người dùng',
              notices: [
                'Thông tin bạn đã nhập sẽ mất',
                'Bạn có chắc thay đổi loại người dùng không?'
              ],
              actions: [
                {
                  actionname: 'đồng ý',
                  actionvalue: true,
                  actiontype: 'test'
                },
                {
                  actionname: 'hủy',
                  actionvalue: false,
                  actiontype: 'test'
                }
              ]
            },
          },
        })
        .onClose.subscribe(switchView => {
          if (switchView) {
            this.typeUser = typeUser;
            this.checkedTypeUser();
          } else {
            this.typeUser = this.typeUser;
            this.checkedTypeUser();
          }
        });
    } else {
      this.typeUser = typeUser;
      this.checkedTypeUser();
    }
  }
  checkedTypeUser() {
    const checkboxs = document.getElementsByName('typyuser');
    for (let i = 0; i < checkboxs.length; i++) {
      if ((<HTMLInputElement>checkboxs[i]).value == this.typeUser) {
        return (<HTMLInputElement>checkboxs[i]).checked = true;
      }
    }
  }
  createdUser() {

  }

  ngOnDestroy() {
    this.manageBuyerService.valueFormCreateBuyer = null;
  }
}
