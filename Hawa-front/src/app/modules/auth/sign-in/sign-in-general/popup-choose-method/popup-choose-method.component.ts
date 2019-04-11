import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { LogServiceService } from '../../../../../shared/service/log-service.service';
import { NbDialogRef } from '@nebular/theme';
@Component({
  selector: 'app-popup-choose-method',
  templateUrl: './popup-choose-method.component.html',
  styleUrls: ['./popup-choose-method.component.scss']
})
export class PopupChooseMethodComponent implements OnInit {
  @Input() callBack: Function;
  verificationPhone = true;
  constructor(
    private router: Router,
    private logServiceService: LogServiceService,
    private ref: NbDialogRef<PopupChooseMethodComponent>,
  ) { }

  ngOnInit() {
  }

  submit() {
    this.logServiceService.verificationPhone = this.verificationPhone;
    this.router.navigate([`/auth/sign-in/forgot-pass`]);
    this.closePopup();
  }

  closePopup() {
    this.ref.close();
  }
}
