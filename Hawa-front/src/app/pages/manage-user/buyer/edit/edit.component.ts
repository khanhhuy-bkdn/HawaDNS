import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ManageBuyerService } from '../../../../shared/service/manage-user-account/manage-buyer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PopupComponent } from '../../../../shared/components/popups/popup/popup.component';
import { NbDialogService } from '@nebular/theme';

@Component({
  selector: 'edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  typeUser: string;
  action = 'edit';
  infoUser;
  subscription: Subscription;
  constructor(
    private router: Router,
    private manageBuyerService: ManageBuyerService,
    private activatedRoute: ActivatedRoute,
    private nbDialogService: NbDialogService,
  ) { }

  ngOnInit() {
    this.subscription = this.activatedRoute.params.subscribe(params => {
      this.manageBuyerService.getInfoUser(+params['id']).subscribe(infoUser => {
        this.infoUser = infoUser;
        this.typeUser = infoUser.type ? infoUser.type.code : null;
        if (infoUser.type && infoUser.type.code) {
          this.checkedTypeUser(infoUser.type.code);
        }
      })
    });
  }

  toggleTypeOfUser(typeUser) {
    if (this.typeUser !== typeUser) {
      this.nbDialogService
        .open(PopupComponent, {
          context: {
            showModel: {
              title: 'thay đổi loại người dùng',
              notices: [
                'Một số thông tin của người dùng có thể sẽ mất',
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
            this.checkedTypeUser(this.typeUser);
          } else {
            this.checkedTypeUser(this.typeUser);
          }
        });
    }
  }
  checkedTypeUser(typeUser) {
    const checkboxs = document.getElementsByName('typyuser');
    for (let i = 0; i < checkboxs.length; i++) {
      if ((<HTMLInputElement>checkboxs[i]).value == typeUser) {
        return (<HTMLInputElement>checkboxs[i]).checked = true;
      }
    }
  }
  createdUser() {

  }
  redirectBack() {
    this.router.navigate(['/pages/buyer']);
    this.manageBuyerService.directToBuyer(true);
  }
}
