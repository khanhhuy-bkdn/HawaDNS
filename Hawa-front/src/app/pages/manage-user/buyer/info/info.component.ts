import { Component, OnInit } from '@angular/core';
import { ManageBuyerService } from '../../../../shared/service/manage-user-account/manage-buyer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
  typeUser: string;
  action = 'info';
  infoUser;
  subscription: Subscription;
  constructor(
    private router: Router,
    private manageBuyerService: ManageBuyerService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.subscription = this.activatedRoute.params.subscribe(params => {
      this.manageBuyerService.getInfoUser(+params['id']).subscribe(infoUser => {
        this.infoUser = infoUser;
        this.typeUser = infoUser.type && infoUser.type.code ? infoUser.type.code : null;
      })
    });

  }
  createdUser() {

  }
  redirectBack() {
    this.router.navigate(['/pages/buyer']);
    this.manageBuyerService.directToBuyer(true);
  }
}
